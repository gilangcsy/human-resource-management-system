const db = require('../models/index.model');
const RoleMenu = db.roleMenu
const sequelize = db.sequelize
const { QueryTypes } = require('sequelize');

module.exports = {
    async read(req, res, next) {
        try {
            const records = await sequelize.query('SELECT * FROM get_all_access_rights', {
                type: QueryTypes.SELECT
            })

            res.status(200).send({
                success: true,
                message: "Get All Access Rights Has Been Successfully.",
                data: records
            })
        }
        catch (err) {
            next(err)
        }
    },
    
    async readByRoleId(req, res, next) {
        try {
            const { role_id } = req.params
            const records = await sequelize.query('SELECT * FROM get_all_access_rights WHERE role_id = $1', {
                type: QueryTypes.SELECT,
                bind: [role_id]
            })

            res.status(200).send({
                success: true,
                message: "Get Access Rights By Role Id Has Been Successfully.",
                data: records
            })
        }
        catch (err) {
            next(err)
        }
    },

    async checkAccessRights(req, res, next) {
        try {
            const { role_id, url } = req.body

            const records = await sequelize.query('SELECT * FROM get_all_access_rights WHERE role_id = $1 AND url = $2', {
                type: QueryTypes.SELECT,
                bind: [role_id, url]
            })

            res.status(200).send({
                success: true,
                message: "Check Access Rights Has Been Successfully.",
                data: records
            })
        }
        catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            const { RoleId, MenuId, allow_create, allow_read, allow_update, allow_delete, created_by } = req.body

            let data = {
                RoleId: RoleId,
                MenuId: MenuId,
                allow_create: allow_create,
                allow_read: allow_read,
                allow_update: allow_update,
                allow_delete: allow_delete,
                created_by: created_by,
                created_by: new Date()
            }

            const create = await RoleMenu.create(data)

            res.status(200).send({
                success: true,
                message: "Create New Access Rights Has Been Successfully.",
                data: data
            })
        }
        catch (err) {
            next(err)
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { allow_create, allow_read, allow_update, allow_delete, updated_by, deleted_at } = req.body
            
            let data = {
                allow_create: allow_create,
                allow_read: allow_read,
                allow_update: allow_update,
                allow_delete: allow_delete,
                updated_by: updated_by,
                updated_at: new Date(),
                deleted_at: deleted_at ? new Date : null
            }

            const update = await RoleMenu.update(data, {
                where: {
                    id: id
                }
            })

            res.status(200).send({
                success: true,
                message: 'Updating role menu has been successfully.',
                data: data
            })
        }
        catch (err) {
            next(err)
        }
    },
}