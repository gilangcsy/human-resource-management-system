const db = require('../models/index.model')
const User = db.user
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
                    deletedAt: null
                },
                attributes: ['id', 'fullName', 'email', 'isActive', 'isVerified'],
                order: [
                    ['createdAt', 'ASC']
                ]
            })

            res.status(200).send({
                success: true,
                message: "Get All User Has Been Successfully.",
                data: userData
            });
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
                    deletedAt: null
                },
                attributes: ['id', 'employeeId', 'fullName', 'email', 'address']
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
            const { email, invitedBy } = req.body

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
                attributes: ['isActive', 'isVerified']
            })

            let isActive = userData.isActive
            let isVerified = userData.isVerified

            if (isActive && isVerified) {
                status = false;
            } else if (!isActive && isVerified) {
                status = true;
            } else {
                res.status(400).json({
                    success: false,
                    message: 'This account needs to accepting the invitational first.'
                })
            }

            const updateUser = await User.update({
                isActive: status
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
            const { employeeId, fullName, address, avatar } = req.body
            const { id } = req.params

            let userUpdate = {}

            console.log(req.file)

            const userData = await User.findOne({
                where: {
                    id: id
                },
                attributes: ['isActive', 'isVerified']
            })

            if(userData) {
                if (req.files) {
                    let upload = multer({ storage: storage }).single('avatar')
                    upload(req, res, function (err) {
                        if (err) {
                            res.send({
                                success: false,
                                message: 'Error uploading file.'
                            })
                        }
                        userUpdate = {
                            employeeId: employeeId,
                            fullName: fullName,
                            address: address,
                            avatar:req.files.avatar.name
                        }
                    })
                } else {
                    let upload = multer({ storage: storage }).single('avatar')
                    upload(req, res, function (err) {
                        if (err) {
                            res.send({
                                success: false,
                                message: 'Error uploading file.'
                            })
                        }
                        userUpdate = {
                            employeeId: employeeId,
                            fullName: fullName,
                            address: address,
                            avatar:req.files.avatar.name
                        }
                    })
                    userUpdate = {
                        employeeId: employeeId,
                        fullName: fullName,
                        address: address
                    }
                }
                // const updateUser = await User.update(userUpdate, {
                //     where: {
                //         id: id
                //     }
                // })

                // res.status(200).json({
                //     success: true,
                //     message: 'User has been updated.',
                //     data: userUpdate
                // })
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
                attributes: ['isActive', 'isVerified']
            })

            if (userData) {
                const updateUser = await User.update({
                    deletedAt: new Date(),
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


    async absensi(req, res, next) {
        try {
            const { clockIn, clockOut, location, latitude, longitude, photo, workLoadStatus, planningActivity, userId } = req.body
            const attendance = await Attendance.findOne({
                limit: 1,
                where: {
                    UserId: req.body.userId
                },
                attributes: ['id', 'clockIn', 'clockOut', 'UserId'],
                order: [
                    ['clockIn', 'DESC']
                ]
            })
            
            if(attendance) {
                let clockIn = attendance.clockIn
                let today = new Date()
                let latestClockin = new Date(clockIn.getFullYear(), clockIn.getMonth(), clockIn.getDate())
                if(latestClockin.getDate() == today.getDate() && latestClockin.getMonth() == today.getMonth() && latestClockin.getFullYear() == today.getFullYear()) {
                    let clockOut = attendance.clockOut
                    if(clockOut) {
                        res.status(400).send({
                            success: false,
                            message: "Your attendance already recorded today."
                        })
                    } else {
                        console.log('update clockout')
                    }
                } else {
                    if(today.getDay() == 6 || today.getDay() == 7) {
                        res.status(400).send({
                            success: false,
                            message: `Cannot attendance in weekend.`
                        })
                    } else {
                        let data = {
                            clockIn: clockIn,
                            workLoadStatus: workLoadStatus,
                            planningActivity: planningActivity,
                            location: location,
                            latitude: latitude,
                            longitude: longitude

                        }
                        console.log('create new clock in')
                    }
                }
            } else {
                if(today.getDay() == 6 || today.getDay() == 7) {
                    res.status(400).send({
                        success: false,
                        message: `Cannot attendance in weekend.`
                    })
                } else {
                    console.log('create new clock in')
                }
            }

            // res.status(200).send({
            //     success: true,
            //     message: "Get All User Has Been Successfully."
            // });
            // const userData = await User.findOne({
            //     where: {
            //         id: 3,
            //         deletedAt: null
            //     },
            //     attributes: ['id', 'employeeId', 'fullName', 'email', 'address', 'createdAt']
            // })
            
			// let createdAt = userData.createdAt
            // let today = new Date()
            // let someDate = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())
            // if(someDate.getDate() == today.getDate() && someDate.getMonth() == today.getMonth() && someDate.getFullYear() == today.getFullYear()) {
            //     console.log(true)
            // } else {
            //     console.log(false)
            // }

            // res.status(200).send({
            //     success: true,
            //     message: "Get All User Has Been Successfully."
            // });
        }
        catch (err) {
            next(err)
        }
    },
}