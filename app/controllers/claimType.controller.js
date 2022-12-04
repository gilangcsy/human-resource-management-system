const db = require('../models/index.model');
const ClaimType = db.claimType

module.exports = {
    async read(req, res, next) {
        try {
            const { id } = req.query;
            const allData = await ClaimType.findAll({
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
                message: "Get All Claim Type Has Been Successfully.",
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

            const data = await ClaimType.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'name']
            })

            if (data) {
                res.status(200).send({
                    success: true,
                    message: "Get Claim Type by Id Has Been Successfully.",
                    data: data
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Claim type not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            const { name, created_by, updated_by } = req.body

            const creatingClaimType = await ClaimType.create(req.body)

            res.status(201).json({
                success: true,
                message: 'Succesfully creating Claim type.',
                data: creatingClaimType
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

            const data = await ClaimType.findOne({
                where: {
                    id: id
                },
                attributes: ['name']
            })

            if (data) {
                const deleteData = await ClaimType.update({
                    deleted_at: new Date(),
                    deleted_by: deleted_by
                }, {
                    where: {
                        id: id
                    }
                })
                res.status(200).json({
                    success: true,
                    message: 'Delete Claim type has been successfully.'
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Claim type not found.'
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

            const data = await ClaimType.findOne({
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
                const update = await ClaimType.update(updatingData, {
                    where: {
                        id: id
                    }
                })

                res.status(200).json({
                    success: true,
                    message: 'Claim type has been updated.'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Claim type not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },
}