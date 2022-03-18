//Memanggil pool
// const pool = require('./dbCon');

const nodemailer = require('nodemailer')
const db = require('../models/index.model')
const User = db.user
const UserInvitation = db.userInvitation
const Op = db.Sequelize.Op
const randtoken = require('rand-token');
const mail = require('../configs/mail.config');

const bcrypt = require("bcrypt");

module.exports = {
    async read(req, res, next) {
        try {
            const { id } = req.query;
            const userData = await User.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
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
}