const cryptoRandomString = require('crypto-random-string');
const auth = require('../middlewares/authentication');
const utils = require('../utils/utils');
const agencySchema = require('../models/agency.model');

// find agency data using email address

const emailData = async(email) => {
    return (await agencySchema.findOne({ 'email': email }))
}

// check mobile number

exports.checkMobile = async(mobile) => {
    return (await agencySchema.findOne({ 'mobile': mobile }))
}

// check email address

exports.checkEmail = async(email) => {
    return (await emailData(email))
}

// edit agency profile

exports.editAgencyProfie = async(req) => {
    if (!req.body.address) {
        return ({ 'error': true, 'message': 'Please fill address...' })
    }
    if (!req.body.mobile) {
        return ({ 'error': true, 'message': 'Please fill mobile number...' })
    }
    if (!req.body.ABNNumber) {
        return ({ 'error': true, 'message': 'Please fill abn number...' })
    }
    if (!req.body.bankName) {
        return ({ 'error': true, 'message': 'Please fill bank name...' })
    }
    if (!req.body.BSB) {
        return ({ 'error': true, 'message': 'Please fill bsb...' })
    }
    if (!req.body.accountNumber) {
        return ({ 'error': true, 'message': 'Please fill account number...' })
    }

    const query = { '_id': req.user._id };
    const obj = {
        address: req.body.address,
        mobile: req.body.mobile,
        ABNNumber: req.body.ABNNumber,
        bankName: req.body.bankName,
        BSB: req.body.BSB,
        accountNumber: req.body.accountNumber
    }
    const newvalues = { $set: obj };
    const options = { new: true };
    const agency = await agencySchema.updateOne(query, newvalues, options)
    if (agency.nModified == 0) {
        return ({ 'error': true, 'message': 'Some error occur in updating field...' })
    }
    return ({ 'error': false, 'message': 'Updated successfully...' })
}