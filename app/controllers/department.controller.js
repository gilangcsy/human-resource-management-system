const db = require('../models/index.model')
const Department = db.department
const Role = db.role

module.exports = {
    async read(req, res, next) {
        try {
            const allData = await Department.findAll({
                where: {
                    deletedAt: null
                },
                attributes: ['id', 'name'],
                include: [
                    {
                        model: Role,
                        attributes: ['id', 'name'],
                        where: {
                            deletedAt: null
                        }
                    },
                ],
                order: [
                    ['name', 'ASC']
                ]
            })

            res.status(200).send({
                success: true,
                message: "Get All Department Has Been Successfully.",
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

            const data = await Department.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'name']
            })

            if (data) {
                res.status(200).send({
                    success: true,
                    message: "Get Department by Id Has Been Successfully.",
                    data: data
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Department not found.'
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

            const creatingDepartment = await Department.create(req.body)

            res.status(201).json({
                success: true,
                message: 'Succesfully creating Department.',
                data: creatingDepartment
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

            const data = await Department.findOne({
                where: {
                    id: id
                },
                attributes: ['name']
            })

            if (data) {
                const deleteData = await Department.update({
                    deletedAt: new Date(),
                    deletedBy: deletedBy
                }, {
                    where: {
                        id: id
                    }
                })
                res.status(200).json({
                    success: true,
                    message: 'Delete Department has been successfully.'
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Department not found.'
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

            const data = await Department.findOne({
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
                const update = await Department.update(updatingData, {
                    where: {
                        id: id
                    }
                })

                res.status(200).json({
                    success: true,
                    message: 'Department has been updated.'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Department not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },
}