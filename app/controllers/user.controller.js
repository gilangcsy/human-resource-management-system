const db = require('../models/index.model')
const User = db.user
const Role = db.role
const Department = db.department
const Attendance = db.attendance

const bcrypt = require("bcrypt");

// Import the filesystem module
const fs = require('fs');

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './app/storage/images/users')
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + extension
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const uploadImg = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 //bytes
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

module.exports = {
    uploadImg: uploadImg,
    async read(req, res, next) {
        try {
            const { id } = req.query;
            const userData = await User.findAll({
                where: {
                    deleted_at: null
                },
                attributes: ['id', 'full_name', 'email', 'is_active', 'is_verified', 'RoleId'],
                include: [
                    {
                        model: Role,
                        attributes: ['id', 'name'],
                        where: {
                            deleted_at: null
                        },
                        include: [
                            {
                                model: Department,
                                attributes: ['id', 'name'],
                                where: {
                                    deleted_at: null
                                }
                            },
                        ],
                    },
                ],
                order: [
                    ['full_name', 'ASC']
                ]
            })

            res.status(200).send({
                success: true,
                message: "Get All User Has Been Successfully.",
                data: userData
            })
        }
        catch (err) {
            next(err)
        }
    },

    async readById(req, res, next) {
        try {
            const { id } = req.params;
            const userData = await User.findOne({
                where: {
                    id: id,
                    deleted_at: null
                },
                attributes: ['id', 'employee_id', 'full_name', 'email', 'address', 'RoleId', 'ttl', 'gender', 'join_date'],
                include: [
                    {
                        model: Role,
                        attributes: ['id', 'name']
                    },
                ]
            })

            if (userData) {
                res.status(200).send({
                    success: true,
                    message: "Get User By Id Has Been Successfully.",
                    data: userData
                })
            } else {
                res.status(400).send({
                    success: false,
                    message: "User not found or maybe has been deleted."
                })
            }
        }
        catch (err) {
            next(err)
        }
    },

    async create(req, res, next) {
        try {
            const invitingUser = await User.create(req.body)

            res.status(201).json({
                success: true,
                message: 'succesfully creating user',
                data: invitingUser
            })
        }
        catch (err) {
            next(err)
        }
    },

    async setActive(req, res, next) {
        try {
            const { id } = req.params
            let status
            const userData = await User.findOne({
                where: {
                    id: id
                },
                attributes: ['is_active', 'is_verified']
            })

            let is_active = userData.is_active
            let is_verified = userData.is_verified

            if (is_active && is_verified) {
                status = false;
            } else if (!is_active && is_verified) {
                status = true;
            } else {
                res.status(400).json({
                    success: false,
                    message: 'This account needs to accepting the invitational first.'
                })
            }

            const updateUser = await User.update({
                is_active: status
            }, {
                where: {
                    id: id
                }
            })

            res.status(200).json({
                success: true,
                message: 'Change active status has been successfully.'
            })
        }
        catch (err) {
            next(err)
        }
    },

    async update(req, res, next) {
        try {
            const { employee_id, full_name, address, RoleId, gender, ttl } = req.body
            const { id } = req.params

            const userData = await User.findOne({
                where: {
                    id: id
                },
                attributes: ['is_active', 'is_verified']
            })

            if(userData) {
                let userUpdate = {
                    employee_id: employee_id,
                    full_name: full_name,
                    address: address,
                    RoleId: RoleId,
                    gender: gender,
                    ttl: ttl
                }
                const updateUser = await User.update(userUpdate, {
                    where: {
                        id: id
                    }
                })

                res.status(200).json({
                    success: true,
                    message: 'User has been updated.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async delete(req, res, next) {
        try {
            const { id, deletedBy } = req.params

            const userData = await User.findOne({
                where: {
                    id: id
                },
                attributes: ['is_active', 'is_verified']
            })

            if (userData) {
                const updateUser = await User.update({
                    deleted_at: new Date(),
                    deletedBy: deletedBy
                }, {
                    where: {
                        id: id
                    }
                })
                res.status(200).json({
                    success: true,
                    message: 'Delete user has been successfully.'
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'User not found.'
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async readGenderAndRoleCount(req, res, next) {
        
        try {

            let men = 0
            let women = 0
            let roleArray = []
            let roleHeader = []

            const userData = await User.findAll({
                where: {
                    deleted_at: null
                },
                attributes: ['id', 'gender'],
                include: [
                    {
                        model: Role,
                        attributes: ['id', 'name']
                    },
                ]
            })

            const roleData = await Role.findAll({
                where: {
                    deleted_at: null
                },
                attributes: ['id', 'name'],
                include: [
                    {
                        model: User,
                        attributes: ['id']
                    },
                ]
            })

            roleData.forEach((item, index) => {
                roleHeader.push(item.name)
                roleArray.push(item.Users.length)
            })

            userData.forEach((item) => {
                men = item.gender == 'L' ? men + 1 : men + 0
                women = item.gender == 'P' ? women + 1 : women + 0
            })
            
            let gender = {
                men: men,
                women: women
            }

            let role = {
                header: roleHeader,
                role: roleArray
            }

            let data = {
                total: userData.length,
                gender: gender,
                role: role
            }

            res.status(200).send({
                success: true,
                message: "Get Gender and Role Count has been successfully.",
                data: data
            })
        }
        catch (err) {
            next(err)
        }
    },

    async getBirthdayByMonth(req, res, next) {
        try {
            const today = new Date()
            
            const allUser = await User.findAll({
                attributes: ['id', 'full_name', 'ttl']
            })

            let data = []

            
            
            allUser.forEach((item, index) => {
                let ttl = new Date(item.ttl)
                
                if(ttl.getMonth() == today.getMonth())
                    data.push({
                        full_name: item.full_name,
                        ttl: item.ttl
                    })
            })

            res.status(200).send({
                success: true,
                data: data
            })
        } catch (err) {
            next(err)
        }

    }
}