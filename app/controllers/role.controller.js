const db = require('../models/index.model');
const Role = db.role

module.exports = {
    async read(req, res, next) {
        try {
            const allData = await Role.findAll({
                where: {
                    deletedAt: null
                },
                attributes: ['id', 'name'],
                order: [
                    ['createdAt', 'ASC']
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

    async readById(req, res, next) {
        try {
            const { id } = req.params

            const data = await Role.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'name']
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
            const { name, createdBy, updatedBy } = req.body

            const creatingRole = await Role.create(req.body)

            res.status(201).json({
                success: true,
                message: 'Succesfully creating Role.',
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
            const { deletedBy } = req.body

            const data = await Role.findOne({
                where: {
                    id: id
                },
                attributes: ['name']
            })

            if (data) {
                const deleteData = await Role.update({
                    deletedAt: new Date(),
                    deletedBy: deletedBy
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
            const { name, updatedBy } = req.body
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
                    updatedBy: updatedBy,
                    updatedAt: new Date()
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
}