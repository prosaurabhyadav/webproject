const cryptoRandomString = require('crypto-random-string');
const auth = require('../middlewares/authentication');
const utils = require('../utils/utils');
const agencySchema = require('../models/agency.model');
const employmentSchema = require('../models/employment.model');
const adminSchema = require('../models/admin.model');

// single login

const emailData = async(email) => {
    return (await agencySchema.findOne({ 'email': email }))
}

const employeeDataEmail = async(email) => {
    return (await employmentSchema.findOne({ 'email': email }))
}

const findEmail = async(email, type) => {
    if (type == 'agency') {
        return ({ 'data': await emailData(email), 'type': type })
    }
    if (type == 'employment') {
        return ({ 'data': await employeeDataEmail(email), 'type': type })
    }
    const detail = await emailData(email)
    if (!detail) {
        return { 'data': await employeeDataEmail(email), type: 'employment' }
    }
    return { 'data': detail, type: 'agency' }
}

exports.login = async(email, password, type) => {
    const loginDetail = await findEmail(email, type)
    if (!loginDetail.data) {
        return ({ 'error': true, 'message': 'Wrong email address...' })
    }
    const valid = await loginDetail.data.comparePassword(password, loginDetail.data.password)
    if (!valid) {
        return ({ 'error': true, 'message': 'Wrong password...' })
    }
    const userTokenData = { 'userId': loginDetail.data._id, 'type': loginDetail.type }
    const token = await auth.newGenerateAccessToken(userTokenData)
    const data = await auth.setData(loginDetail.data)
    return ({ 'error': false, 'message': 'Login successfully...', 'data': data, 'type': loginDetail.type, 'token': token })
}

// single change password

const updatePass = async(userId, password, type) => {
    const query = { '_id': userId }
    const obj = { password: password }
    const newvalues = { $set: obj }
    const options = { new: true }

    if (type == 'agency') {
        return (await agencySchema.updateOne(query, newvalues, options))
    } else if (type == 'employment') {
        return (await employmentSchema.updateOne(query, newvalues, options))
    }
}

// agent update password

const agencyUpdatePassword = async(userId, oldPassword, trimPassword, type) => {
    const agency = await agencySchema.findOne({ _id: userId })

    if (!agency) {
        return ({ 'error': true, 'message': 'Agent not found...' })
    }
    const valid = agency.comparePassword(oldPassword, agency.password)

    if (!valid) {
        return ({ 'error': true, 'message': 'Your current password is wrong...' })
    } else {
        const newPaswwordValid = agency.comparePassword(trimPassword, agency.password)
        if (newPaswwordValid) {
            return ({ 'error': true, 'message': 'Your new password cannot be same as last password...' })
        }
        const password = agency.encryptPassword(trimPassword)
        const updateDetail = await updatePass(userId, password, type)
        if (updateDetail.nModified == 0) {
            return ({ 'error': true, 'message': 'Some error occur in updating password...' })
        }
        return ({ 'error': false, 'message': 'Password updated successfully...' })
    }
}

// employee update password

const employeeUpdatePassword = async(userId, oldPassword, trimPassword, type) => {
    const employee = await employmentSchema.findOne({ _id: userId })

    if (!employee) {
        return ({ 'error': true, 'message': 'Employee not found...' })
    }
    const valid = employee.comparePassword(oldPassword, employee.password)

    if (!valid) {
        return ({ 'error': true, 'message': 'Your current password is wrong...' })
    } else {
        const newPaswwordValid = employee.comparePassword(trimPassword, employee.password)
        if (newPaswwordValid) {
            return ({ 'error': true, 'message': 'Your new password cannot be same as last password...' })
        }
        const password = employee.encryptPassword(trimPassword)
        const updateDetail = await updatePass(userId, password, type)
        if (updateDetail.nModified == 0) {
            return ({ 'error': true, 'message': 'Some error occur in updating password...' })
        }
        return ({ 'error': false, 'message': 'Password updated successfully...' })
    }
}

exports.updatePassword = async(req) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    if (!oldPassword) {
        return ({ 'error': true, 'message': 'Please fill old password...' })
    }
    if (!newPassword) {
        return ({ 'error': true, 'message': 'Please fill new password...' })
    }
    if (!confirmPassword) {
        return ({ 'error': true, 'message': 'Please fill confirm password...' })
    }
    const trimPassword = newPassword.replace(/\s+/g, '')
    if (newPassword.length < 6) {
        return ({ 'error': true, 'message': 'New password must be of length 6 or more...' })
    } else {
        if (newPassword.length != trimPassword.length) {
            return ({ 'error': true, 'message': 'New password must not contain any whitespaces...' })
        }
    }

    if (trimPassword != confirmPassword) {
        return ({ 'error': true, 'message': 'New password and conform password does not match...' })
    }
    if (req.type == 'agency') {
        return (await agencyUpdatePassword(req.user._id, oldPassword, trimPassword, req.type))
    } else if (req.type == 'employment') {
        return (await employeeUpdatePassword(req.user._id, oldPassword, trimPassword, req.type))
    } else {
        return ({ 'error': true, 'message': 'Invalid user...' })
    }
}

// single forgot password

exports.forgotPassword = async(email, type) => {
    const data = await findEmail(email, type)
    if (!data.data) {
        return ({ 'error': true, 'message': 'Wrong email address...' })
    }

    if (data.type == 'agency') {
        const password = cryptoRandomString({ length: 6, type: 'alphanumeric' });
        const encryptPassword = data.data.encryptPassword(password)
        const updateDetail = await updatePass(data.data._id, encryptPassword, 'agency')
        if (updateDetail.nModified == 0) {
            return ({ 'error': true, 'message': 'Some error occur...' })
        }
        const subject = "Welcome to StripperGram";
        const message = '<p>Hello ' + data.data.fullname + ',</p>' + '<p>Your password is:' + password + '</p>';

        await utils.sendotpemail(data.data.email, subject, message);
        return ({ 'error': false, 'message': 'Password sent to your email-id ' + data.data.email });
    }
    if (data.type == 'employment') {
        const password = cryptoRandomString({ length: 6, type: 'alphanumeric' });
        const encryptPassword = data.data.encryptPassword(password)
        const updateDetail = await updatePass(data.data._id, encryptPassword, 'employment')
        if (updateDetail.nModified == 0) {
            return ({ 'error': true, 'message': 'Some error occur...' })
        }
        const subject = "Welcome to StripperGram";
        const message = '<p>Hello ' + data.data.firstname + ',</p>' + '<p>Your password is:' + password + '</p>';

        await utils.sendotpemail(data.data.email, subject, message);
        return ({ 'error': false, 'message': 'Password sent to your email-id ' + data.data.email });
    }
}

// single logout

exports.logout = async(req) => {
    if (req.type == 'agency') {
        const up = await agencySchema.updateOne({ '_id': req.user._id }, { $pull: { 'tokens': req.token } }, { new: true })
        if (up.nModified == 0) {
            return ({ 'error': true, 'message': 'Some error occur in logout...' })
        }
        return ({ 'error': false, 'message': 'Logout successfully...' })
    } else if (req.type == 'employment') {
        const up = await employmentSchema.updateOne({ '_id': req.user._id }, { $pull: { 'tokens': req.token } }, { new: true })
        if (up.nModified == 0) {
            return ({ 'error': true, 'message': 'Some error occur in logout...' })
        }
        return ({ 'error': false, 'message': 'Logout successfully...' })
    } else if (req.type == 'admin') {
        const up = await adminSchema.updateOne({ '_id': req.user._id }, { 'tokens': '' }, { new: true })
        if (up.nModified == 0) {
            return ({ 'error': true, 'message': 'Some error occur in logout...' })
        }
        return ({ 'error': false, 'message': 'Logout successfully...' })
    } else {
        return ({ 'error': true, 'message': 'Invalid user...' })
    }
}