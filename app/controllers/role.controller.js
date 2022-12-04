const db = require('../models/index.model')
const Role = db.role
const User = db.user

module.exports = {
    async readWithUser(req, res, next) {
        try {
            const allData = await Role.findAll({
                where: {
                    deleted_at: null
                },
                attributes: ['id', 'name'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'full_name', 'RoleId'],
                        where: {
                            deleted_at: null,
                            is_verified: true,
                            is_active: true
                        },
                    },
                ],
                order: [
                    ['created_at', 'ASC']
                ]
            })

            res.status(200).send({
                success: true,
                message: "Get All Role Has Been Successfully.",
                data: allData
            })
        }
        catch (err) {
            next(err)
        }
    },

    async read(req, res, next) {
        try {
            const allData = await Role.findAll({
                where: {
                    deleted_at: null
                },
                attributes: ['id', 'name'],
                order: [
                    ['created_at', 'ASC']
                ]
            })

            res.status(200).send({
                success: true,
                message: "Get All Role Has Been Successfully.",
                data: allData
            })
        }
        catch (err) {
            next(err)
        }
    },

    async readBySuperiorId(req, res, next) {
        try {
            const { superior_id } = req.params
            const allData = await Role.findAll({
                where: {
                    deleted_at: null,
                    superior_id: superior_id
                },
                attributes: ['id', 'name'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'full_name', 'RoleId'],
                        where: {
                            deleted_at: null,
                            isVerified: true,
                            isActive: true
                        },
                    },
                ],
                order: [
                    ['created_at', 'ASC']
                ]
            })

            res.status(200).send({
                success: true,
                message: "Get All Role Has Been Successfully.",
                data: allData
            })
        }catch (err) {
            next(err)
        }
    },

    async readById(req, res, next) {
        try {
            const { id } = req.params

            const data = await Role.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'name', 'superior_id']
            })

            if (data) {
                res.status(200).send({
                    success: true,
                    message: "Get Role by Id Has Been Successfully.",
                    data: data
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Role not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            const { name, superior_id, created_by, updated_by, DepartmentId } = req.body

            console.log(req.body)

            const creatingRole = await Role.create(req.body)

            res.status(201).json({
                success: true,
                message: 'Succesfully creating role.',
                data: creatingRole
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

            const data = await Role.findOne({
                where: {
                    id: id
                },
                attributes: ['name']
            })

            if (data) {
                const deleteData = await Role.update({
                    deleted_at: new Date(),
                    deleted_by: deleted_by
                }, {
                    where: {
                        id: id
                    }
                })
                res.status(200).json({
                    success: true,
                    message: 'Delete Role has been successfully.'
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Role not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async update(req, res, next) {
        try {
            const { name, updated_by, superior_id } = req.body
            const { id } = req.params

            const data = await Role.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'name']
            })

            if(data) {
                let updatingData = {
                    name: name,
                    updated_by: updated_by,
                    superior_id: superior_id,
                    updated_at: new Date()
                }
                const update = await Role.update(updatingData, {
                    where: {
                        id: id
                    }
                })

                res.status(200).json({
                    success: true,
                    message: 'Role has been updated.'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Role not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async checkSuperior(req, res, next) {
        try {
            
        } catch (err) {
            res.status(400).send({
                success: false,
                message: err.message
            })
        }
    }
}