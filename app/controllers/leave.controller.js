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
            const { start_date, end_date, description, created_by, UserId, LeaveTypeId } = req.body
            
            let data = {
                leave_start_date: start_date,
                leave_end_date: end_date,
                description: description,
                created_by: created_by,
                UserId: UserId,
                LeaveTypeId: LeaveTypeId,
            }

            if(req.files) {
                let attachment = req.files
                let filePdf = []
                attachment.forEach((item, index) => {
                    filePdf.push(item.filename)
                })

                data.attachment = filePdf
            }

            const createLeave = await Leave.create(data)

            res.status(201).json({
                success: true,
                message: 'Successfully applying leave.',
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
            const { status } = req.query

            let records

            if(status) {
                records = await sequelize.query('SELECT * FROM get_all_leaves WHERE requester_id = $1 AND last_status = $2', {
                    type: QueryTypes.SELECT,
                    bind: [id, status]
                })
            } else {
                records = await sequelize.query('SELECT * FROM get_all_leaves WHERE requester_id = $1', {
                    type: QueryTypes.SELECT,
                    bind: [id]
                })
            }
            
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
        try {
            let data = {}
            let attachment
            const { id } = req.params
            const { start_date, end_date, description, created_by, updated_by, UserId, LeaveTypeId } = req.body
            
            const leave = await Leave.findByPk(id)
            let existsAttachment = leave.attachment || []
    
            if(leave) {
                data = {
                    leave_start_date: end_date,
                    leave_end_date: start_date,
                    description: description,
                    created_by: created_by,
                    updated_by: updated_by,
                    UserId: UserId,
                    LeaveTypeId: LeaveTypeId,
                }
        
                if(req.files) {
                    let newAttachment = req.files
                    newAttachment.forEach((item) => {
                        existsAttachment.push(item.filename)
                    })
                    data.attachment = existsAttachment
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
                res.status(404).send({
                    success: false,
                    message: 'ID Not Found.'
                })
            }
        } catch (err) {
            next(err)            
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
    },

    async removeAttachment(req, res, next) {
        try {
            const { attachment, leaveId } = req.body
            const leave = await Leave.findByPk(leaveId)
            let oldAttachment = leave.attachment
            let newAttachment = []
            
            oldAttachment.forEach((item) => {
                if(item != attachment) {
                    newAttachment.push(item)
                } else {
                    const path = process.cwd() + '/storage/attachment/leaves/' + item
                    if (fs.existsSync(path)) {
                        //file exists
                        fs.unlink(path, (err) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                        })
                    }
                }
            })

            data = {
                attachment: newAttachment
            }
            
            const update = await Leave.update(data, {
                where: {
                    id: leaveId
                }
            })
            
            res.status(200).send({
                success: true,
                message: 'Succesfully removing attachment in leave application.'
            })
        } catch (err) {
            next(err)
        }
    },

    async getCountAllStatus(req, res, next) {
        try {
            const { userId } = req.query
            let records
            if(userId) {
                records = await sequelize.query('SELECT last_status FROM get_all_leaves WHERE requester_id = $1', {
                    type: QueryTypes.SELECT,
                    bind: [userId]
                })
            } else {
                records = await sequelize.query('SELECT last_status FROM get_all_leaves', {
                    type: QueryTypes.SELECT
                })
            }

            let waiting = 0, approved = 0, rejected = 0

            records.forEach((item) => {
                waiting = item.last_status == 'Waiting for Validation' ? waiting + 1 : waiting + 0
                approved = item.last_status == 'Approved' ? approved + 1 : approved + 0
                rejected = item.last_status == 'Rejected' ? rejected + 1 : rejected + 0
            })

            res.status(200).send({
                success: true,
                message: 'Get count all status has been successful.',
                data: {
                    waiting: waiting,
                    approved: approved,
                    rejected: rejected
                }
            })
        } catch (err) {
            next(err)
        }
    }
}