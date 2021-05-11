const utils = require('../utils/responses');
const userService = require('../services/user.service');

// single login

exports.login = async(req, res) => {
    try {
        if (!req.body.email) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill email address..' })
        }
        if (!req.body.password) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill password...' })
        }
        const response = await userService.login(req.body.email, req.body.password, req.body.type)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// single change password

exports.updatePassword = async(req, res) => {
    try {
        const response = await userService.updatePassword(req)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// single forgot password

exports.forgotPassword = async(req, res) => {
    try {
        if (!req.body.email) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill email address...' })
        }
        const response = await userService.forgotPassword(req.body.email, req.body.type)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// single logout

exports.logout = async(req, res) => {
    try {
        const response = await userService.logout(req)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}