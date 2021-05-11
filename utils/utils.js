const nodemailer = require('nodemailer');
const multer = require('multer');
const cryptoRandomString = require('crypto-random-string');

// send mail

exports.sendotpemail = function sendMail(to, subject, message) {
    return new Promise((resolve, reject) => {
        const smtpConfig = {
            service: "gmail",
            auth: {
                user: process.env.USER,
                pass: process.env.PASSWORD
            },
        };
        const transporter = nodemailer.createTransport(smtpConfig);
        const mailOptions = {
            from: 'noreply<process.env.USER>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: 'Hello world ?', // plaintext body
            html: message // html body
        };

        transporter.sendMail(mailOptions)
            .then(info => {
                resolve(info.response)
            })
            .catch(err => {
                reject(err)
            })
    })
}


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        //cb (null,false)
        cb(new Error("File format should be PNG,JPG,JPEG"), false);
    }
}

const Storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, req.imagePath)
    },
    filename: function(req, file, cb) {
        cb(null, cryptoRandomString({ length: 32, type: 'hex' }) + '.' + file.mimetype.split('/')[1])
    }
})

const upload = multer({
    storage: Storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2 // we are allowing only 2 MB files
    }
})

exports.upl = upload;