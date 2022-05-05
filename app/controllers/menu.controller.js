const db = require('../models/index.model')
const Menu = db.menu
const sequelize = db.sequelize
const { QueryTypes } = require('sequelize')

module.exports = {
    async readAll(req, res, next) {
        try {
            const allData = await Menu.findAll({
                where: {
                    deletedAt: null,
                    is_active: true
                },
                attributes: ['id', 'name', 'icon', 'url', 'is_active', 'master_menu'],
                order: [
                    ['master_menu', 'ASC'],
                    ['position_number', 'ASC']
                ]
            })

            res.status(200).send({
                success: true,
                message: "Get All Menu Has Been Successfully.",
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
            const allData = await Menu.findOne({
                where: {
                    deletedAt: null,
                    is_active: true,
                    id: id
                },
                attributes: ['id', 'name', 'icon', 'url', 'is_active', 'master_menu'],
                order: [
                    ['master_menu', 'ASC'],
                    ['position_number', 'ASC']
                ]
            })

            res.status(200).send({
                success: true,
                message: "Get Menu By Id Has Been Successfully.",
                data: allData
            })
        }
        catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            const { name, icon, url, is_active, master_menu, createdBy } = req.body
            
            let data = {
                name: name,
                icon: icon,
                url: url,
                is_active: is_active,
                master_menu: master_menu,
                createdBy: createdBy,
                createdAt: new Date()
            }
            if(master_menu != 0) {
                const findMasterMenu = await Menu.findOne({
                    where: {
                        id: master_menu,
                        deletedAt: null,
                        is_active: true,
                    },
                    order: [
                        ['position_number', 'DESC']
                    ]
                })

                if(findMasterMenu == null) {
                    res.status(404).send({
                        success: false,
                        message: 'Master menu not found.',
                    })
                } else {
                    const findLastPositionNumber = await Menu.findOne({
                        where: {
                            master_menu: master_menu,
                            deletedAt: null,
                            is_active: true
                        },
                        order: [
                            ['position_number', 'DESC']
                        ]
                    })
                    data.position_number = findLastPositionNumber ? findLastPositionNumber.position_number + 1 : 1
                }
            } else {
                const getLatestPositionMasterMenu = await Menu.findOne({
                    where: {
                        deletedAt: null,
                        is_active: true,
                    },
                    order: [
                        ['position_number', 'DESC']
                    ],
                    attributes: ['position_number']
                })

                data.position_number = getLatestPositionMasterMenu ? getLatestPositionMasterMenu.position_number + 1 : 1
            }

            const createData = await Menu.create(data)

            res.status(200).send({
                success: true,
                message: 'Create menu has been successfully.',
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
            const { name, icon, url, is_active, master_menu, updatedBy } = req.body
            
            let data = {
                name: name,
                icon: icon,
                url: url,
                is_active: is_active,
                updatedBy: updatedBy,
                updatedAt: new Date()
            }
            
            const findMenuById = await Menu.findOne({
                where: {
                    id: id,
                    deletedAt: null,
                    is_active: true,
                }
            })

            if(findMenuById) {
                const updateData = await Menu.update(data, {
                    where: {
                        id: id
                    }
                })
    
                res.status(200).send({
                    success: true,
                    message: 'Update menu has been successfully.'
                })
            } else {
                res.status(404).send({
                    success: true,
                    message: 'Menu not found.'
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

            const data = await Menu.findOne({
                where: {
                    id: id
                },
                attributes: ['name']
            })

            if (data) {
                const deleteData = await Menu.update({
                    deletedAt: new Date(),
                    deletedBy: deletedBy
                }, {
                    where: {
                        id: id
                    }
                })
                res.status(200).json({
                    success: true,
                    message: 'Delete menu has been successfully.'
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Menu not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async readMasterMenu(req, res, next) {
        try {
            const allData = await Menu.findAll({
                where: {
                    deletedAt: null,
                    is_active: true,
                    master_menu: 0
                },
                attributes: ['id', 'name'],
                order: [
                    ['position_number', 'ASC']
                ]
            })

            res.status(200).send({
                success: true,
                message: "Get Master Menu Has Been Successfully.",
                data: allData
            })
        }
        catch (err) {
            next(err)
        }
    },

    async readSubMenu(req, res, next) {
        try {
            const records = await sequelize.query('SELECT * FROM get_all_submenu_and_mastermenu', {
                type: QueryTypes.SELECT
            })

            res.status(200).send({
                success: true,
                message: "Get All sub menu with master menu has been successfully.",
                data: records
            })
        }
        catch (err) {
            next(err)
        }
    },

    async newPositions(req, res, next) {
        try {
            const { positions, updatedBy } = req.body

            positions.forEach((index) => {
                console.log(index[0])
                let data = {
                    position_number: index[1],
                    updatedBy: updatedBy,
                    updatedAt: new Date()
                }

                Menu.update(data, {
                    where: {
                        id: index[0]
                    }
                }).then(function (data) {
                    console.log(data)
                })
            })

            res.status(200).send({
                success: true,
                message: 'Update menu has been successfully.'
            })
        }
        catch (err) {
            next(err)
        }
    },
}