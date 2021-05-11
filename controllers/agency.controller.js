const utils = require('../utils/responses');
const agencyService = require('../services/agency.service');
const agencySchema = require('../models/agency.model');

// signup

exports.signup = async(req, res) => {
    try {
        if (!req.body.fullname) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill fullname...' })
        }
        if (!req.body.address) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill address...' })
        }
        if (!req.body.mobile) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill mobile number...' })
        }
        if (!req.body.email) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill email...' })
        }
        if (!req.body.password) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill password...' })
        }
        if (!req.body.ABNNumber) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill ABN Number...' })
        }
        if (!req.body.bankName) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill bank name...' })
        }
        if (!req.body.BSB) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill BSB...' })
        }
        if (!req.body.accountNumber) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill accountNumber...' })
        }
        if (!req.body.licenseorpassport) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please upload license or passport...' })
        }
        if (!req.body.utilitybill) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please upload utility bill or credit card...' })
        }

        if (req.body.password.length < 6) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Password must be of length 6 or more...' })
        } else {
            const trimPassword = req.body.password.replace(/\s+/g, '')
            if (req.body.password.length != trimPassword.length) {
                return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Password must not contain any whitespaces...' })
            }
        }


        const allAgents = await agencySchema.find()
        let mo = 0;
        let em = 1;
        allAgents.forEach(element => {
            if (element.email.toLowerCase() == req.body.email.toLowerCase()) {
                mo = 1
            }
            if (element.mobile == req.body.mobile) {
                em = 2
            }
        })
        if (mo == 1) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Email already registered...' })
        }
        if (em == 2) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Mobile number already registered...' })
        }

        const agencyDetail = new agencySchema({
            fullname: req.body.fullname,
            address: req.body.address,
            mobile: req.body.mobile,
            email: req.body.email,
            password: req.body.password,
            ABNNumber: req.body.ABNNumber,
            bankName: req.body.bankName,
            BSB: req.body.BSB,
            accountNumber: req.body.accountNumber,
            licenseORpassport: req.body.licenseorpassport,
            utilityBilORMedicardeORCreditCard: req.body.utilitybill

        })
        const u = await agencyDetail.save()

        return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Successfully registered...' })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// agent profile

exports.agentProfile = async(req, res) => {
    try {
        return utils.sendSuccessResponse(res, { 'error': false, 'message': req.user })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// edit agent profile

exports.edit = async(req, res) => {
    try {
        const response = await agencyService.editAgencyProfie(req)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        if (err.code == 11000) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Mobile number already registered...' })
        }
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}