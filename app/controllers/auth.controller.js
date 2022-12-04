//Memanggil pool
// const pool = require('./dbCon');
const config = require('../configs/auth.config');
const nodemailer = require('nodemailer')
const mail = require('../configs/mail.config')
const randtoken = require('rand-token');
const db = require('../models/index.model')
const jwt = require('jsonwebtoken')
const User = db.user
const UserInvitation = db.userInvitation
const PasswordReset = db.passwordReset
const UserLog = db.userLog
const Op = db.Sequelize.Op

const bcrypt = require('bcrypt');
const e = require('express')
const { mailNotification } = require('../helpers/helpers')

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
                        include: ['id', 'email', 'is_verified']
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
                        host: 'smtp.mail.yahoo.com',
                        port: 587,
                        auth: {
                            user: mail.EMAIL,
                            pass: mail.PASSWORD
                        },
                        tls: { 
                            rejectUnauthorized: false 
                        }
                    })
                    
                    let url = req.headers.host == 'localhost:3068' ? 'http://127.0.0.1:8000' : 'https://intranet.ids.co.id'

                    let message = {
                        from: "noreply.csy@yahoo.com",
                        to: invitingUser.email,
                        subject: "Invitational - IDS Intranet",
                        html: `<p>Hello! We'd like to invite you to our apps. If you want to join, please click button below. Thanks!</p> <br> <a href='${url}/auth/invitational/${token}' target='_blank'>Accept Now</a>`,
                        // attachments: [
                        //     {
                        //         filename: 'onlinewebtutor.png',
                        //         path: __dirname + '/onlinewebtutor.png',
                        //         cid: 'uniq-onlinewebtutor.png'
                        //     }
                        // ]
                    }

                    transporter.sendMail(message, function (err, info) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(info);
                            res.status(201).json({
                                success: true,
                                message: 'Succesfully inviting user.',
                                userData: invitingUser,
                                invitingData: invitingConfirmation
                            })
                        }
                    })
                } else {
                    if(userData.is_verified) {
                        res.status(400).json({
                            success: false,
                            message: 'This account already registered.'
                        })
                    } else {
                        let transporter = nodemailer.createTransport({
                            host: 'smtp.mail.yahoo.com',
                            port: 587,
                            auth: {
                                user: mail.EMAIL,
                                pass: mail.PASSWORD
                            },
                            tls: { 
                                rejectUnauthorized: false 
                            }
                        })
                        
                        let url = req.headers.host == 'localhost:3068' ? 'http://127.0.0.1:8000' : 'https://intranet.ids.co.id'
    
                        let message = {
                            from: "noreply.csy@yahoo.com",
                            to: userData.email,
                            subject: "Invitational - IDS Intranet",
                            html: `<p>Hello! We'd like to invite you to our apps. If you want to join, please click button below. Thanks!</p> <br> <a href='${url}/auth/invitational/${token}' target='_blank'>Accept Now</a>`,
                            // attachments: [
                            //     {
                            //         filename: 'onlinewebtutor.png',
                            //         path: __dirname + '/onlinewebtutor.png',
                            //         cid: 'uniq-onlinewebtutor.png'
                            //     }
                            // ]
                        }
    
                        const invitingConfirmation = await UserInvitation.create({
                            UserId: userData.id,
                            expiredDate: expiredDate,
                            token: token,
                            invitedBy: invitedBy
                        })

                        transporter.sendMail(message, function (err, info) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(info);
                                res.status(201).json({
                                    success: true,
                                    message: 'Succesfully re-create token.',
                                    invitingData: invitingConfirmation
                                })
                            }
                        })
                        

                    }
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
                        attributes: ['id', 'email', 'is_verified']
                    },
                ]
            })

            if (userData) {
                if(userData.User != null) {
                    if (userData.User.dataValues.is_verified) {
                        res.status(400).json({
                            success: false,
                            is_verified: true,
                            message: 'User already registered.'
                        })
                    } else {
                        let ToDate = new Date();
                        if (new Date(userData.expiredDate).getTime() <= ToDate.getTime()) {
                            res.status(200).send({
                                success: false,
                                message: "Token already expired.",
                                data: userData
                            })
                        } else {
                            res.status(200).send({
                                success: true,
                                message: "Token is valid.",
                                data: userData
                            })
                        }
                    }
                } else {
                    res.status(404).json({
                        success: false,
                        is_verified: false,
                        message: 'User not found.'
                    })
                }

            } else {
                res.status(400).send({
                    success: false,
                    message: "Token is not found."
                })
            }

        }
        catch (err) {
            next(err)
        }
    },

    async acceptingInvitation(req, res, next) {
        try {
            const { token, full_name, password } = req.body
            const user = await UserInvitation.findOne({
                where: {
                    token: token
                },
                attributes: ['id'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'is_verified']
                    },
                ]
            })

            if (user) {
                const hashedPassword = bcrypt.hashSync(password, 10);
                if (user.User.dataValues.is_verified) {
                    res.status(400).json({
                        success: false,
                        is_verified: true,
                        message: 'User already registered.'
                    })
                } else {
                    const updateUser = await User.update({
                        full_name: full_name,
                        password: hashedPassword,
                        is_active: true,
                        is_verified: true,
                        updated_at: new Date(),
                        updated_by: user.User.dataValues.id
                    }, {
                        where: {
                            id: user.User.dataValues.id
                        }
                    })
    
                    const updateInvitation = await UserInvitation.update({
                        isApproved: true,
                        updated_at: new Date(),
                        updated_by: user.User.dataValues.id
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

            } else {
                res.status(400).send({
                    success: false,
                    message: "User is not found."
                })
            }

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
                attributes: ['id', 'email', 'employee_id', 'is_active', 'is_verified', 'password', 'full_name'],
                include: [
                    {
                        model: db.role,
                        attributes: ['id', 'name']
                    },
                ]
            })
            
            if (userData) {
                if (!userData.is_verified) {
                    res.status(400).json({
                        success: false,
                        message: 'Your account is not verified. Check your email or call the admin for inviting you.'
                    })
                }
                if (!userData.is_active) {
                    res.status(400).json({
                        success: false,
                        message: 'Your account is inactive. Call the admin to activating your account.'
                    })
                }
                const validatedPassword = bcrypt.compareSync(password, userData.password) // true
                if (validatedPassword) {
                    const tokenJwt = jwt.sign({ id: userData.id }, config.secret, {
                        expiresIn: 10800 // 3 hours
                    })

                    res.status(201).json({
                        success: true,
                        message: 'login has been successfully',
                        credentials: {
                            token: tokenJwt,
                            userId: userData.id,
                            email: userData.email,
                            employee_id: userData.employee_id,
                            full_name: userData.full_name,
                            role: userData.Role.name,
                            role_id: userData.Role.id
                        }
                    })
                } else {
                    res.status(400).json({
                        success: false,
                        message: 'Your email is not registered or your password is wrong.'
                    })
                }
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Your email is not registered or your password is wrong.'
                })
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
    },

    async passwordResetNotification(req, res, next) {
        try {
            const { email } = req.body
            const token = randtoken.generate(64)
            let created_at = new Date()
            const expiredDate = new Date(created_at.getFullYear(), created_at.getMonth(), created_at.getDate(), created_at.getHours(), created_at.getMinutes() + parseInt('5'), created_at.getSeconds())
            const host = req.headers.host == 'localhost:3068' ? 'http://127.0.0.1:8000' : 'https://intranet.ids.co.id'
            const url = `${host}/auth/forgot-password?token=${token}`
            const config = {
                title: "Password Reset - IDS Intranet",
                email: email,
                message: "Someone (hopefully you) has asked us to reset the password for your IDS Intranet account. Please click the button below to do so. If you didn't request this password reset, you can go ahead and ignore this email!",
                token: token,
                endpoint: url,
                button: "Reset your password"
            }

            const findUser = await User.findOne({
                where: {
                    email: email
                }
            })

            if(findUser) {
                mailNotification(config)
                const passwordReset = await PasswordReset.create({
                    email: email,
                    token: token,
                    expiredDate: expiredDate
                })
            }

            res.status(200).json({
                success: true,
                message: 'Password reset confirmation has been sent.'
            })
        } catch (err) {
            next(err)
        }
    },

    async passwordResetCheckToken(req, res, next) {
        try {
            const { token } = req.query
            const checkToken = await PasswordReset.findOne({
                where: {
                    token: token
                }
            })

            let ToDate = new Date()
            if(checkToken)
                if (new Date(checkToken.expiredDate).getTime() <= ToDate.getTime() || checkToken.isUsed)
                    res.status(200).send({
                        success: false,
                        message: "Token already expired or used."
                    })
                else
                    res.status(200).send({
                        success: true,
                        message: "Token is valid.",
                        data: checkToken
                    })
            else
                    res.status(404).send({
                        success: false,
                        message: "Token not found."
                    })
        } catch (err) {
            next(err)
        }
    },

    async setNewPassword(req, res, next) {
        try {
            const { token } = req.query
            const { password } = req.body
            const hashedPassword  = bcrypt.hashSync(password, 10)
            const checkToken = await PasswordReset.findOne({
                where: {
                    token: token
                }
            })

            let ToDate = new Date();
            let tokenTime = new Date(checkToken.expiredDate)
            if (new Date(checkToken.expiredDate).getTime() <= ToDate.getTime()) {
                res.status(200).send({
                    success: false,
                    message: "Token already expired."
                })
            } else {
                const updateTokenStatus = await PasswordReset.update({
                    isUsed: true
                }, {
                    where: {
                        token: token
                    }
                })
                const updatePassword = await User.update({
                    password: hashedPassword
                }, {
                    where: {
                        email: checkToken.email
                    }
                })

                res.status(200).send({
                    success: true,
                    message: "Update password has been successfully."
                })
            }
        } catch (err) {
            next(err)
        }
    },

    async checkToken(req, res, next) {
        try {
            const { token } = req.body
            
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    return res.status(401).send({
                        success: false,
                        message: 'Unauthorized!'
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: 'Token valid.'
                });
            })
        } catch (err) {
            next(err)
        }
    }
}
