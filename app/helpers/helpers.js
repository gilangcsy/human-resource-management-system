
const nodemailer = require('nodemailer')
const mail = require('../configs/mail.config')

function mailNotification(config) {
    let message = {
        from: "noreply.csy@yahoo.com",
        to: config.email,
        subject: config.title,
        html: `<p>${config.message}</p> <br> <a href='${config.endpoint}' target='_blank'>${ config.button }</a>`,
        // attachments: [
        //     {
        //         filename: 'onlinewebtutor.png',
        //         path: __dirname + '/onlinewebtutor.png',
        //         cid: 'uniq-onlinewebtutor.png'
        //     }
        // ]
    }

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

    var result

    transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(true)
        }
    })
}

module.exports = {
    mailNotification: mailNotification
}