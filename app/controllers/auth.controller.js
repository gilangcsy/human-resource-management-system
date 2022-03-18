//Memanggil pool
// const pool = require('./dbCon');

const nodemailer = require('nodemailer')
const db = require('../models/index.model')
const jwt = require('jsonwebtoken')
const User = db.user
const UserInvitation = db.userInvitation
const UserLog = db.userLog
const Op = db.Sequelize.Op
const randtoken = require('rand-token');
const mail = require('../configs/mail.config')
const config = require('../configs/auth.config')

const bcrypt = require('bcrypt');

module.exports = {
    async invite(req, res, next) {
        try {
            let created_at = new Date()
            const { email, invitedBy } = req.body
            const expiredDate = new Date(created_at.getFullYear(), created_at.getMonth(), created_at.getDate() + parseInt('2'), created_at.getHours(), created_at.getMinutes(), created_at.getSeconds())
            const token = randtoken.generate(64)

            if (!email) {
                res.status(400).json({
                    success: false,
                    message: 'email required'
                })
            } else {
                const userData = await User.findOne({
                    where: {
                        email: email
                    },
                    attributes: {
                        include: ['id', 'email']
                    }
                })

                if (!userData) {
                    const invitingUser = await User.create(req.body)
                    const invitingConfirmation = await UserInvitation.create({
                        UserId: invitingUser.id,
                        expiredDate: expiredDate,
                        token: token,
                        invitedBy: invitedBy
                    })
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: mail.EMAIL,
                            pass: mail.PASSWORD
                        }
                    });

                    // let message = {
                    //     from: "noreplyjustread8@gmail.com",
                    //     to: invitingUser.email,
                    //     subject: "Invitational - IDS Intranet",
                    //     html: "<p>Hello! We'd like to invite you to our apps. If you want to join, please click button below. Thanks!</p> <br> <a href='http://localhost:3000/api/v1/users'>Accept Now!</a>",
                    //     // attachments: [
                    //     //     {
                    //     //         filename: 'onlinewebtutor.png',
                    //     //         path: __dirname + '/onlinewebtutor.png',
                    //     //         cid: 'uniq-onlinewebtutor.png'
                    //     //     }
                    //     // ]
                    // }

                    // transporter.sendMail(message, function (err, info) {
                    //     if (err) {
                    //         console.log(err);
                    //     } else {
                    //         console.log(info);
                    //     }
                    // })
                    res.status(201).json({
                        success: true,
                        message: 'succesfully inviting user',
                        userData: invitingUser,
                        invitingData: invitingConfirmation
                    })
                } else {
                    const invitingConfirmation = await UserInvitation.create({
                        UserId: userData.id,
                        expiredDate: expiredDate,
                        token: token,
                        invitedBy: invitedBy
                    })
                    res.status(201).json({
                        success: true,
                        message: 'succesfully inviting user',
                        data: invitingConfirmation
                    })
                }
            }
        }
        catch (err) {
            next(err)
        }
    },

    async expiredCheck(req, res, next) {
        try {
            const { token } = req.body;
            const userData = await UserInvitation.findOne({
                where: {
                    token: token
                },
                attributes: ['id', 'token', 'expiredDate', 'UserId'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'email', 'isVerified']
                    },
                ]
            })

            if (userData) {
                if (userData.User.dataValues.isVerified) {
                    res.status(400).json({
                        success: false,
                        isVerified: true,
                        message: 'User already registered.'
                    })
                }

                let ToDate = new Date();
                if (new Date(userData.expiredDate).getTime() <= ToDate.getTime()) {
                    res.status(200).send({
                        success: true,
                        isExpired: true,
                        isVerified: false,
                        message: "Token is valid but already expired.",
                        data: userData
                    })
                }
                res.status(200).send({
                    success: true,
                    isExpired: false,
                    isVerified: false,
                    message: "Token is valid and not expired.",
                    data: userData
                })
            }
            res.status(400).send({
                success: false,
                message: "Token is not found."
            })

        }
        catch (err) {
            next(err)
        }
    },

    async acceptingInvitation(req, res, next) {
        try {
            const { token, password } = req.body
            const user = await UserInvitation.findOne({
                where: {
                    token: token
                },
                attributes: ['id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'isVerified']
                    },
                ]
            })

            console.log(user.User.dataValues.isVerified)

            if (user) {
                const hashedPassword = bcrypt.hashSync(password, 10);
                if (user.User.dataValues.isVerified) {
                    res.status(400).json({
                        success: false,
                        isVerified: true,
                        message: 'User already registered.'
                    })
                }
                const updateUser = await User.update({
                    password: hashedPassword,
                    isActive: true,
                    isVerified: true,
                    updatedAt: new Date(),
                    updatedBy: user.User.dataValues.id
                }, {
                    where: {
                        id: user.User.dataValues.id
                    }
                })

                const updateInvitation = await UserInvitation.update({
                    isApproved: true,
                    updatedAt: new Date(),
                    updatedBy: user.User.dataValues.id
                }, {
                    where: {
                        token: token
                    }
                })

                res.status(201).json({
                    success: true,
                    message: 'succesfully accepting invitation'
                })

            }
            res.status(400).send({
                success: false,
                message: "User is not found."
            })

        } catch (err) {
            next(err)
        }
    },

    async login(req, res, next) {
        try {
            const { email, password, device, detail, longitude, latitude, address } = req.body
            const userData = await User.findOne({
                where: {
                    email: email
                },
                attributes: ['id', 'email', 'employeeId', 'isActive', 'isVerified', 'password']
            })

            if (userData) {
                if (!userData.isVerified) {
                    res.status(400).json({
                        success: false,
                        message: 'your account is not verified. check your email or call the admin for inviting you.'
                    })
                }
                if (!userData.isActive) {
                    res.status(400).json({
                        success: false,
                        message: 'your account is inactive. call the admin to activating your account.'
                    })
                }
                const validatedPassword = bcrypt.compareSync(password, userData.password); // true
                if (validatedPassword) {
                    const tokenJwt = jwt.sign({ id: userData.id }, config.secret, {
                        expiresIn: 10800 // 24 hours
                    })

                    const userLog = await UserLog.create({
                        UserId: userData.id,
                        token: token,
                        longitude: longitude,
                        latitude: latitude,
                        address: address,
                        device: device,
                        detail: detail,
                        isLogin: true
                    })

                    res.status(201).json({
                        success: true,
                        message: 'login has been successfully',
                        credentials: {
                            token: tokenJwt,
                            userId: userData.id,
                            email: userData.email,
                            employeeId: userData.employeeId,
                        }
                    })
                }
            }
        } catch (err) {
            next(err)
        }
    },

    async logout(req, res, next) {
        try {
            const { jwtToken } = req.body
            jwt.sign(jwtToken, "", { expiresIn: 1 }, (logout, err) => {
                if (logout) {
                    res.status(200).send({
                        success: true,
                        message: 'You have been Logged Out'
                    });
                } else {
                    res.send({ msg: err.message | 'Error' });
                }
            });
        } catch (err) {
            next(err)
        }
    }
}