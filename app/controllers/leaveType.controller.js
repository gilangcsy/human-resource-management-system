const db = require('../models/index.model');
const LeaveType = db.leaveType

module.exports = {
    async read(req, res, next) {
        try {
            const { id } = req.query;
            const allData = await LeaveType.findAll({
                where: {
                    deleted_at: null
                },
                attributes: ['id', 'name'],
                order: [
                    ['name', 'ASC']
                ]
            })

            res.status(200).send({
                success: true,
                message: "Get All Leave Type Has Been Successfully.",
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

            const data = await LeaveType.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'name']
            })

            if (data) {
                res.status(200).send({
                    success: true,
                    message: "Get Leave Type by Id Has Been Successfully.",
                    data: data
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Leave type not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            const { name, createdBy, updated_by } = req.body

            const creatingLeaveType = await LeaveType.create(req.body)

            res.status(201).json({
                success: true,
                message: 'Succesfully creating leave type.',
                data: creatingLeaveType
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

            const data = await LeaveType.findOne({
                where: {
                    id: id
                },
                attributes: ['name']
            })

            if (data) {
                const deleted_ata = await LeaveType.update({
                    deleted_at: new Date(),
                    deleted_by: deleted_by
                }, {
                    where: {
                        id: id
                    }
                })
                res.status(200).json({
                    success: true,
                    message: 'Delete leave type has been successfully.'
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Leave type not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async update(req, res, next) {
        try {
            const { name, updated_by } = req.body
            const { id } = req.params

            const data = await LeaveType.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'name']
            })

            if(data) {
                let updatingData = {
                    name: name,
                    updated_by: updated_by,
                    updated_at: new Date()
                }
                const update = await LeaveType.update(updatingData, {
                    where: {
                        id: id
                    }
                })

                res.status(200).json({
                    success: true,
                    message: 'Leave type has been updated.'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Leave type not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },
}