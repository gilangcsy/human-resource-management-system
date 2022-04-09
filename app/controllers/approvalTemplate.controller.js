const db = require('../models/index.model');
const ApprovalTemplate = db.approvalTemplate
const {
    QueryTypes
} = require('sequelize')

const dbConfig = require('../configs/db.config')
const SCHEMA = dbConfig.SCHEMA

module.exports = {
    async read(req, res, next) {
        try {
            const { id } = req.query;
            const ApprovalTemplate = `${SCHEMA}."ApprovalTemplate"`
            const User = `${SCHEMA}."User"`
            let query = `
                SELECT
                    ${ApprovalTemplate}.id,
                    ${ApprovalTemplate}.name,
                    approver_one.full_name as approver_one_name,
                    approver_two.full_name as approver_two_name,
                    approver_three.full_name as approver_three_name
                FROM ${ApprovalTemplate}
                    LEFT OUTER JOIN ${User} AS approver_one ON approver_one.id = ${ApprovalTemplate}.approver_one
                    LEFT OUTER JOIN ${User} AS approver_two ON approver_two.id = ${ApprovalTemplate}.approver_two
                    LEFT OUTER JOIN ${User} AS approver_three ON approver_three.id = ${ApprovalTemplate}.approver_three
                WHERE ${ApprovalTemplate}.is_active = true AND ${ApprovalTemplate}.deleted_at IS NULL
                `
            const [results, metadata] = await db.sequelize.query(query)
            res.status(200).send({
                success: true,
                message: "Get All Approval Template Has Been Successfully.",
                data: results
            })
        }
        catch (err) {
            next(err)
        }
    },

    async readById(req, res, next) {
        try {
            const { id } = req.params;
            const ApprovalTemplate = `${SCHEMA}."ApprovalTemplate"`
            const User = `${SCHEMA}."User"`
            let query = `
                SELECT
                    ${ApprovalTemplate}.id,
                    ${ApprovalTemplate}.name,
                    approver_one.full_name as approver_one_name,
                    approver_two.full_name as approver_two_name,
                    approver_three.full_name as approver_three_name
                FROM ${ApprovalTemplate}
                    LEFT OUTER JOIN ${User} AS approver_one ON approver_one.id = ${ApprovalTemplate}.approver_one
                    LEFT OUTER JOIN ${User} AS approver_two ON approver_two.id = ${ApprovalTemplate}.approver_two
                    LEFT OUTER JOIN ${User} AS approver_three ON approver_three.id = ${ApprovalTemplate}.approver_three
                WHERE ${ApprovalTemplate}.is_active = true AND ${ApprovalTemplate}.id = ${id} AND ${ApprovalTemplate}.deleted_at IS NULL
                `
            const [results, metadata] = await db.sequelize.query(query)
            if(metadata.rowCount != 0) {
                res.status(200).send({
                    success: true,
                    message: "Get Approval Template By Id Has Been Successfully.",
                    data: results
                })
            } else {
                res.status(404).send({
                    success: false,
                    message: "Get Approval Template By Id Has Been Failed. Id Not Found."
                })
            }
        }
        catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            const { name, type, approver_one, approver_two, approver_three, created_by } = req.body

            console.log(req.body)

            if(!name || !approver_one) {
                res.status(404).json({
                    success: false,
                    message: 'Create Approval Template Has Been Failed. Check your field again.'
                })
            }

            const creatingApprovalTemplate = await ApprovalTemplate.create(req.body)

            res.status(201).json({
                success: true,
                message: 'Create Approval Template Has Been Successfully.',
                data: creatingApprovalTemplate
            })
        }
        catch (err) {
            next(err)
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params
            const { deleted_by } = req.body

            const data = await ApprovalTemplate.findOne({
                where: {
                    id: id
                },
                attributes: ['name']
            })

            if (data) {
                const deleteData = await ApprovalTemplate.update({
                    deleted_at: new Date(),
                    deleted_by: deleted_by
                }, {
                    where: {
                        id: id
                    }
                })
                res.status(200).json({
                    success: true,
                    message: 'Delete approval template has been successfully.'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Delete approval template has been failed. Id not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async update(req, res, next) {
        try {
            const { name, type, approver_one, approver_two, approver_three, updatedBy } = req.body
            const { id } = req.params

            const data = await ApprovalTemplate.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'name']
            })

            if(data) {
                let updatingData = {
                    name: name,
                    type: type,
                    approver_one: approver_one,
                    approver_two: approver_two,
                    approver_three: approver_three,
                    updatedBy: updatedBy,
                    updatedAt: new Date()
                }
                const update = await ApprovalTemplate.update(updatingData, {
                    where: {
                        id: id
                    }
                })

                res.status(200).json({
                    success: true,
                    message: 'Updating approval template has been success.'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Delete approval template has been failed. Id not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },
}