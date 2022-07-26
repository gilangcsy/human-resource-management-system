const db = require('../models/index.model');
const Task = db.taskManagement
const sequelize = db.sequelize
const { QueryTypes } = require('sequelize');
const User = db.user
const Role = db.role

module.exports = {
    async read(req, res, next) {
        try {
            let query = `
                SELECT * FROM get_all_tasks
                `
            const [results, metadata] = await db.sequelize.query(query)
            
            res.status(200).send({
                success: true,
                message: "Get All Tasks Has Been Successfully.",
                data: results
            })
        }
        catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            const { name, startDate, endDate, assignTo, priority, status, ownerId, description, createdBy } = req.body

            const taskData = {
                name: name,
                startDate: startDate,
                description: description,
                endDate: endDate,
                assignTo: assignTo,
                priority: priority,
                status: status,
                ownerId: ownerId,
                createdBy
            }

            const createTask = await Task.create(taskData)

            res.status(200).send({
                success: true,
                message: 'Create task has been succeed.',
                data: taskData
            })
        } catch (err) {
            res.status(400).send({
                success: false,
                message: err.message
            })
        }
    },

    async readById (req, res, next) {
        try {
            const { id } = req.params

            const findTaskById = await Task.findByPk(id)

            res.status(200).send({
                success: true,
                message: 'Get task by id has been succeed.',
                data : findTaskById
            })
        } catch (err) {
            res.status(400).send({
                success: false,
                message: err.message
            })
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params
            const { name, startDate, endDate, assignTo, priority, status, ownerId, description, updatedBy } = req.body
            
            const taskData = {
                name: name,
                startDate: startDate,
                description: description,
                endDate: endDate,
                assignTo: assignTo,
                priority: priority,
                status: status,
                ownerId: ownerId,
                updatedBy: updatedBy
            }

            const updateTask = await Task.update(taskData, {
                where : {
                    id: id
                }
            })

            res.status(200).send({
                success: true,
                message: 'Update task by id has been succeed.',
                data: taskData
            })

        } catch (err) {
            res.status(400).send({
                success: false,
                message: err.message
            })
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params
            const { deletedBy } = req.body
            const deleteData = {
                deletedAt: new Date(),
                deletedBy: deletedBy
            }
            const softDelete = await Task.update(deleteData, {
                where: {
                    id: id
                }
            })
            
            res.status(200).send({
                success: true,
                message: 'Delete task by id has been succeed.'
            })
        } catch (err) {
            res.status(400).send({
                success: false,
                message: err.message
            })
        }
    },

    async readByUser(req, res, next) {
        try {
            const { id } = req.params
            
            const findUser = await User.findByPk(id)
            if (!findUser) {
                res.status(400).send({
                    success: false,
                    message: "User ID Not found."
                })
            } else {
                const roleId = findUser.RoleId

                const findRole = await Role.findByPk(roleId)

                if (!findRole) {
                    res.status(400).send({
                        success: false,
                        message: "Role ID Not found."
                    })
                } else {
                    let myTask
                    let memberTask
                    let data = {}
                    let isSuperior = false

                    myTask = await sequelize.query('SELECT * FROM get_all_tasks WHERE assign_to_id = $1', {
                        type: QueryTypes.SELECT,
                        bind: [id]
                    })
                    
                    memberTask = await sequelize.query('SELECT * FROM get_all_tasks WHERE owner_id = $1 AND assign_to_id != $1', {
                        type: QueryTypes.SELECT,
                        bind: [id]
                    })

                    data.myTask = myTask
                    data.memberTask = memberTask
                    isSuperior = true

                    data.isSuperior = isSuperior
                    
                    res.status(200).send({
                        success: true,
                        message: "Get All Tasks Has Been Successfully.",
                        data: data
                    })
                }
            }
        } catch (err) {
            res.status(400).send({
                success: false,
                message: err.message
            })
        }
    }

}