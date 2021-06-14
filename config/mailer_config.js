const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,// true for 465, false for other ports
    auth: {
      user: process.env.MAILER_EMAIL, // generated ethereal user
      pass: process.env.MAILER_PASS, // generated ethereal password
    },
})

module.exports = transporter