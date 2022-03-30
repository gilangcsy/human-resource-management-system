const db = require('../models/index.model')
const User = db.user
const Attendance = db.attendance

const bcrypt = require("bcrypt");

// Import the filesystem module
const fs = require('fs');

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'clockInPhoto') {
            cb(null, './storage/images/attendances/clockIn')
        } else {
            cb(null, './storage/images/attendances/clockOut')
        }
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + extension
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({
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
})

module.exports = {

    upload: upload,
    async create(req, res, next) {
        try {
            let today = new Date()
            const { location, latitude, longitude, photo, workLoadStatus, planningActivity, userId } = req.body
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

            if (today.getDay() == 6 || today.getDay() == 7) {
                res.status(400).send({
                    success: false,
                    message: `Cannot attendance in weekend.`
                })
            } else {
                if (attendance) {
                    let attendanceId = attendance.id
                    let clockIn = attendance.clockIn
                    let latestClockin = new Date(clockIn.getFullYear(), clockIn.getMonth(), clockIn.getDate())

                    if (latestClockin.getDate() == today.getDate() && latestClockin.getMonth() == today.getMonth() && latestClockin.getFullYear() == today.getFullYear()) {
                        let clockOut = attendance.clockOut
                        if (clockOut) {
                            res.status(400).send({
                                success: false,
                                message: "Your attendance already recorded today."
                            })
                        } else {
                            let clockOutPhoto = req.files['0'].filename
                            let data = {
                                clockOut: new Date(),
                                clockOutPhoto: clockOutPhoto,
                                updatedBy: userId,
                                location: location,
                                latitude: latitude,
                                longitude: longitude,
                            }
                            const attendingOut = await Attendance.update(data, {
                                where: {
                                    id: attendanceId
                                }
                            })
                            res.status(200).send({
                                success: true,
                                message: `Attending out has been successfully.`
                            })
                        }
                    } else {
                        let clockInPhoto = req.files['0'].filename
                        let data = {
                            clockInPhoto: clockInPhoto,
                            workLoadStatus: workLoadStatus,
                            planningActivity: planningActivity,
                            location: location,
                            latitude: latitude,
                            longitude: longitude,
                            UserId: userId,
                            createdBy: userId
                        }
                        const attendingIn = await Attendance.create(data)
                        res.status(200).send({
                            success: true,
                            message: `New attending added successfully.`,
                            data: attendingIn
                        })
                    }
                } else {
                    let clockInPhoto = req.files['0'].filename
                    let data = {
                        clockInPhoto: clockInPhoto,
                        workLoadStatus: workLoadStatus,
                        planningActivity: planningActivity,
                        location: location,
                        latitude: latitude,
                        longitude: longitude,
                        UserId: userId,
                        createdBy: userId
                    }
                    const attendingIn = await Attendance.create(data)
                    res.status(200).send({
                        success: true,
                        message: `New attending added successfully.`,
                        data: attendingIn
                    })
                }
            }
        }
        catch (err) {
            next(err)
        }
    },

    async readById(req, res, next) {
        try {
            const { id } = req.params;
            const attendance = await Attendance.findOne({
                where: {
                    id: id,
                    deletedAt: null
                },
                attributes: ['id', 'clockIn', 'clockOut', 'clockInPhoto', 'clockOutPhoto', 'location', 'longitude', 'latitude', 'workLoadStatus', 'planningActivity']
            })

            if (attendance) {
                res.status(200).send({
                    success: true,
                    message: "Get Attendance By Id Has Been Successfully.",
                    data: attendance
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

    async readByUserId(req, res, next) {
        try {
            const { id } = req.params;
            const attendance = await Attendance.findAll({
                where: {
                    UserId: id,
                    deletedAt: null
                },
                attributes: ['id', 'clockIn', 'clockOut'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'employeeId', 'fullName'],
                        where: {
                            deletedAt: null
                        },
                    },
                ],
                order: [
                    ['clockIn', 'ASC']
                ]
            })

            if (attendance) {
                res.status(200).send({
                    success: true,
                    message: "Get Attendance By User Id Has Been Successfully.",
                    data: attendance
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

    async readTodayAttendance(req, res, next) {
        let today = new Date()
        const { id } = req.params
        const attendance = await Attendance.findOne({
            limit: 1,
            where: {
                UserId: id
            },
            attributes: ['id', 'clockIn', 'clockOut', 'workLoadStatus', 'planningActivity'],
            order: [
                ['clockIn', 'DESC']
            ]
        })

        if (attendance) {
            let attendanceId = attendance.id
            let clockIn = attendance.clockIn
            let latestClockin = new Date(clockIn.getFullYear(), clockIn.getMonth(), clockIn.getDate())

            if (latestClockin.getDate() == today.getDate() && latestClockin.getMonth() == today.getMonth() && latestClockin.getFullYear() == today.getFullYear()) {
                let clockOut = attendance.clockOut
                if (clockOut) {
                    res.status(200).send({
                        success: true,
                        status: 'Already Recorded',
                        data: attendance
                    })
                } else {
                    res.status(200).send({
                        success: true,
                        status: 'Clock Out',
                        data: attendance
                    })
                }
            } else {
                res.status(200).send({
                    success: true,
                    status: 'Clock In',
                    data: attendance
                })
            }
        } else {
            res.status(200).send({
                success: true,
                status: 'Clock In',
                data: attendance
            })
        }
    },

    async update(req, res, next) {
        const { id } = req.params
        const { workLoadStatus, planningActivity, updatedBy } = req.body
        let data = {
            workLoadStatus: workLoadStatus,
            planningActivity: planningActivity,
            updatedBy: updatedBy
        }
        const update = await Attendance.update(data, {
            where: {
                id: id
            }
        })
        res.status(200).send({
            success: true,
            message: "Update attendance has been successful"
        })
    }
}