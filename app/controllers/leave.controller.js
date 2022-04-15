const db = require('../models/index.model');
const Leave = db.leave
const sequelize = db.sequelize
const dbConfig = require('../configs/db.config')
const fs = require('fs');
const path = require('path')

const multer = require('multer');
const { QueryTypes } = require('sequelize');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage/attachment/leaves')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + extension
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2097152 //bytes or 2mb
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'application/pdf') {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .pdf format allowed!'));
        }
    }
})

module.exports = {
    upload: upload,

    async read(req, res, next) {
        try {
            const { id } = req.query;
            let query = `
                SELECT * FROM get_all_leaves
                `
            const [results, metadata] = await db.sequelize.query(query)
            res.status(200).send({
                success: true,
                message: "Get All Leaves Has Been Successfully.",
                data: results
            })
        }
        catch (err) {
            next(err)
        }
    },

    async readById(req, res, next) {
        try {
            const { id } = req.params

            const records = await sequelize.query('SELECT * FROM get_all_leaves WHERE id = $1', {
                type: QueryTypes.SELECT,
                bind: [id]
            })
            res.status(200).send({
                success: true,
                message: "Get Leave By Id Has Been Successfully.",
                data: records
            })
        }
        catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            let attachment_name = null
            const { start_date, end_date, description, attachment, created_by, UserId, LeaveTypeId } = req.body
            if(req.file) {
                attachment_name = req.file.filename
            }
            let data = {
                leave_start_date: start_date,
                leave_end_date: end_date,
                description: description,
                attachment: attachment_name,
                created_by: created_by,
                UserId: UserId,
                LeaveTypeId: LeaveTypeId,
            }

            const createLeave = await Leave.create(data)

            res.status(201).json({
                success: true,
                message: 'Succesfully applied for Leave.',
                data: data
            })
        }
        catch (err) {
            next(err)
        }
    },

    async readByUserId(req, res, next) {
        try {
            const { id } = req.params

            const records = await sequelize.query('SELECT * FROM get_all_leaves WHERE requester_id = $1', {
                type: QueryTypes.SELECT,
                bind: [id]
            })
            res.status(200).send({
                success: true,
                message: "Get All Leave By User Id Has Been Successfully.",
                data: records
            })
        }
        catch (err) {
            next(err)
        }
    },

    async update(req, res, next) {
        let data = {}
        let attachment
        const { id } = req.params
        const { start_date, end_date, description, created_by, updated_by, UserId, LeaveTypeId } = req.body
        
        
        const records = await sequelize.query('SELECT * FROM get_all_leaves WHERE id = $1', {
            type: QueryTypes.SELECT,
            bind: [id]
        })
        
        if(records[0] != null) {
            if(req.file) {
                attachment_name = req.file.filename
                const path = process.cwd() + '/storage/attachment/leaves/' + records[0].attachment
                fs.unlink(path, (err) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
                data = {
                    leave_start_date: leave_start_date,
                    leave_end_date: leave_end_date,
                    description: description,
                    attachment: attachment_name,
                    created_by: created_by,
                    updated_by: updated_by,
                    UserId: UserId,
                    LeaveTypeId: LeaveTypeId,
                }
            } else {
                data = {
                    leave_start_date: start_date,
                    leave_end_date: end_date,
                    description: description,
                    created_by: created_by,
                    updated_by: updated_by,
                    UserId: UserId,
                    LeaveTypeId: LeaveTypeId,
                }
            }
            const update = await Leave.update(data, {
                where: {
                    id: id
                }
            })
            
            res.status(200).send({
                success: true,
                message: 'Succesfully updating leave application'
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Update leave application has been failed. Id not found.'
            })
        }
        
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params
            const { deleted_by } = req.body

            const data = await Leave.findOne({
                where: {
                    id: id
                },
                attributes: ['id']
            })

            if (data) {
                const deleteData = await Leave.update({
                    deleted_at: new Date(),
                    deleted_by: deleted_by
                }, {
                    where: {
                        id: id
                    }
                })
                res.status(200).json({
                    success: true,
                    message: 'Deleting leave application has been successfully.'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Delete leave application has been failed. Id not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async readByApproverNowId(req, res, next) {
        try {
            const { id } = req.params

            const activeApproval = await sequelize.query('SELECT * FROM get_all_leaves WHERE approver_now = $1', {
                type: QueryTypes.SELECT,
                bind: [id]
            })

            const historyApproval = await sequelize.query('SELECT * FROM get_all_leaves WHERE approver_one = $1 OR approver_two = $1 OR approver_three= $1', {
                type: QueryTypes.SELECT,
                bind: [id]
            })

            res.status(200).send({
                success: true,
                message: 'Get Leaves By Approver Now Id Has Been Successfully.',
                data: activeApproval,
                history: historyApproval
            })
        } catch (err) {
            next (err)
        }
    },

    async approve(req, res, next) {
        try {
            const { UserId, id, isApproved } = req.body

            const records = await sequelize.query('SELECT * FROM get_all_leaves WHERE id = $1 LIMIT 1', {
                type: QueryTypes.SELECT,
                bind: [id]
            })

            let data = {}

            if(records) {
                if(records[0].approver_one == UserId) {
                    data.approval_one_status = isApproved == 1 ? true : false
                } else if(records[0].approver_two == UserId) {
                    data.approval_two_status = isApproved == 1 ? true : false
                } else if(records[0].approver_three== UserId) {
                    data.approval_three_status = isApproved == 1 ? true : false
                } else {
                    res.status(404).send({
                        success: false,
                        message: 'You dont have authorization to approve leave application.'
                    })
                }

                data.approval_one_date = new Date()
                data.updated_by = UserId
                data.updated_at = new Date()

                const update = await Leave.update(data, {
                    where: {
                        id: id
                    }
                })

                res.status(200).send({
                    success: true,
                    message: `Succesfully ${data.approval_three_status = isApproved == 1 ? 'approving' : 'rejecting'} leave application`
                })
            }
        } catch (err) {
            next (err)
        }
    },

    async download(req, res, next) {
        try {
            const attachment = req.params.attachment
            let doc_path = ('./storage/attachment/leaves/' + attachment)

            res.download(doc_path)
        } catch (err) {
            next(err)
        }
    }
}