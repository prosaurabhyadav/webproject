const utils = require('../utils/responses');
const agencyHomeService = require('../services/agency.home.service');
const adminService = require('../services/admin.service');

// male profile data and its categories

exports.profileandCategory = async(req, res) => {
    try {
        const response = await agencyHomeService.profileandCategoryandSubCategory(req.params.gender)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// sub-category detail

exports.subCategoryDetail = async(req, res) => {
    try {
        const response = await agencyHomeService.subCategoryDetail(req.params.subcategoryid)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get all event

exports.event = async(req, res) => {
    try {
        const response = await agencyHomeService.event()
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Events not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'event': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// description of shows

exports.descriptionOfShows = async(req, res) => {
    try {
        const response = await adminService.getDescription(req.params.descriptiontype)
        if (!response) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Description not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'descriptionDetail': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// sub-category data

exports.subCategoryData = async(req, res) => {
    try {
        const response = await agencyHomeService.subCategoryData(req.params.subcategoryid)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// all employee on the basis of gender

exports.activeEmployee = async(req, res) => {
    try {
        const response = await agencyHomeService.activeEmployee(req.params.gender)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// employee detail

exports.employeeDetail = async(req, res) => {
    try {
        const response = await agencyHomeService.employeeDetail(req.params.employeeid)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// all services

exports.allServices = async(req, res) => {
    try {
        const response = await agencyHomeService.allServices(req.params.gender)
        if (!response) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Record not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'allServices': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// employee by sub-category

exports.employeeBySubCategory = async(req, res) => {
    try {
        const response = await agencyHomeService.employeeBySubCategory(req.params.subcategoryid)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}