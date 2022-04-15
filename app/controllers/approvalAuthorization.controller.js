const db = require('../models/index.model')
const ApprovalAuthorization = db.approvalAuthorization
const ApprovalTemplate = db.approvalTemplate
const { QueryTypes } = require('sequelize')
const sequelize = db.sequelize

module.exports = {
    async read(req, res, next) {
        try {
            const { id } = req.query;
            let query = `
                SELECT * FROM get_all_approval_authorization
                `
            const [results, metadata] = await db.sequelize.query(query)
            res.status(200).send({
                success: true,
                message: "Get All Approval Authorization Has Been Successfully.",
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

            const records = await sequelize.query('SELECT * FROM get_all_approval_authorization WHERE id = $1', {
                type: QueryTypes.SELECT,
                bind: [id]
            })
            res.status(200).send({
                success: true,
                message: "Get Approval Authorization By Id Has Been Successfully.",
                data: records
            })
        }
        catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            const { RoleId, createdBy, ApprovalTemplateId } = req.body
            
            const findApprovalTemplateType = await ApprovalTemplate.findByPk(ApprovalTemplateId, {
                attributes: ['type']
            })

            const approvalAlreadyExists = await sequelize.query('SELECT * FROM get_all_approval_authorization WHERE role_id = $1 AND approval_template_type = $2', {
                type: QueryTypes.SELECT,
                bind: [RoleId, findApprovalTemplateType.type]
            })
            if(approvalAlreadyExists[0]) {
                    res.status(400).json({
                        success: false,
                        message: `Cannot create approval authorization. Role ${approvalAlreadyExists[0].role_name} already have approval for ${approvalAlreadyExists[0].approval_template_type}.`
                    })
            } else {
                let createData = {
                    ApprovalTemplateId: ApprovalTemplateId,
                    RoleId: RoleId,
                    createdBy: createdBy
                }

                const create = await ApprovalAuthorization.create(createData)

                res.status(201).json({
                    success: true,
                    message: 'Succesfully creating Approval Authorization.',
                    data: create
                })
            }
        }
        catch (err) {
            next(err)
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params
            const { deletedBy } = req.body

            const data = await ApprovalAuthorization.findOne({
                where: {
                    id: id
                },
                attributes: ['id']
            })

            if (data) {
                const deleteData = await ApprovalAuthorization.update({
                    deleted_at: new Date(),
                    deleted_by: deletedBy
                }, {
                    where: {
                        id: id
                    }
                })
                res.status(200).json({
                    success: true,
                    message: 'Delete Approval Authorization has been successfully.'
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Approval Authorization not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async update(req, res, next) {
        try {
            const { RoleId, updatedBy, ApprovalTemplateId } = req.body
            const { id } = req.params

            const data = await ApprovalAuthorization.findOne({
                where: {
                    id: id
                },
                attributes: ['id']
            })

            if(data) {
                let updatingData = {
                    RoleId: RoleId,
                    ApprovalTemplateId: ApprovalTemplateId,
                    updatedBy: updatedBy,
                    updatedAt: new Date()
                }
                const update = await ApprovalAuthorization.update(updatingData, {
                    where: {
                        id: id
                    }
                })

                res.status(200).json({
                    success: true,
                    message: 'Approval authorization has been updated.'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Approval authorization not found.'
                })
            }
        }
        catch (err) {
            next(err)
        }
    },
}