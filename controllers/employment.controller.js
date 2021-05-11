const multer = require('multer');
const normalize = require('normalize-path');
const fs = require('fs')
const utils = require('../utils/responses');
const employmentService = require('../services/employment.service');
const employmentSchema = require('../models/employment.model');
const employeeSurchargeSchema = require('../models/employee.surcharge.model');
const utilss = require('../utils/utils')

// get state name

exports.stateName = async(req, res) => {
    try {
        const response = await employmentService.stateName()
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'States not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'stateName': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get state postcode

exports.statePostcode = async(req, res) => {
    try {
        const response = await employmentService.statePostcode(req.params.stateid)
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'States postcode not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'statePostcode': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// check email address

exports.checkEmail = async(req, res) => {
    try {
        const response = await employmentService.checkEmail(req.body.email)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// check mobile number

exports.checkMobile = async(req, res) => {
    try {
        const response = await employmentService.checkMobile(req.body.mobile)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// employee signup

exports.signup = async(req, res) => {
    try {
        if (req.body.email != req.body.confirmEmail) {
            return utils.sendSuccessResponse(res, ({ 'error': true, 'message': 'Email and confirm email is not same...' }))
        }
        if (req.body.password != req.body.confirmPassword) {
            return utils.sendSuccessResponse(res, ({ 'error': true, 'message': 'Password and confirm password is not same...' }))
        }
        if (!req.body.serviceSurcharge || !req.body.serviceSurcharge.length) {
            return utils.sendSuccessResponse(res, ({ 'error': true, 'message': 'Please define surcharges...' }))
        }
        if (req.body.serviceSurcharge.length != req.body.serviceSubCategory.length) {
            return utils.sendSuccessResponse(res, ({ 'error': true, 'message': 'Please define all selected subcategory surcharges...' }))
        }

        const employmentDetail = new employmentSchema({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            stageName: req.body.stageName,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password,
            address: req.body.address,
            postcodeId: req.body.postcodeId,
            stateId: req.body.stateId,
            country: req.body.country,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            facebook: req.body.facebook,
            instagram: req.body.instagram,
            facebookEmail: req.body.facebookEmail,
            instagramEmail: req.body.instagramEmail,
            gender: req.body.gender,
            dob: req.body.dob,
            RSA: req.body.RSA,
            hairColor: req.body.hairColor,
            licenseORpassport: req.body.licenseORpassport,
            utilityBilORMedicardeORCreditCard: req.body.utilityBill,
            profilePhoto: req.body.profilePhoto,
            biography: req.body.biography,
            bankName: req.body.bankName,
            accountHolderName: req.body.accountHolderName,
            BSB: req.body.BSB,
            accountNumber: req.body.accountNumber,
            yourSpeciality: req.body.yourSpeciality,
            serviceCategory: req.body.serviceCategory,
            serviceSubCategory: req.body.serviceSubCategory,
            termConditionEmail: req.body.termConditionEmail,
            termConditionAccept: req.body.termConditionAccept,
            guidelines: req.body.guidelines,
            paymentTermsTravelRates: req.body.paymentTermsTravelRates
        })

        const data = await employmentDetail.save()

        const surchargeData = []
        let sur = {}

        req.body.serviceSurcharge.forEach(element => {
            sur = {
                employeeId: data._id,
                serviceCategoryId: element.categoryId,
                serviceSubCategoryId: element.subCategoryId,
                serviceSurcharge: element.serviceSurcharge
            }
            surchargeData.push(sur)
        })
        const da = await employeeSurchargeSchema.insertMany(surchargeData)
        return utils.sendSuccessResponse(res, ({ 'error': false, 'message': 'Successfully registered...' }))
    } catch (err) {
        if (err.code == 11000) {
            if (err.keyValue.email) {
                return utils.sendSuccessResponse(res, ({ 'error': true, 'message': 'Email already registered...' }))
            }
            return utils.sendSuccessResponse(res, ({ 'error': true, 'message': 'Mobile number already registered...' }))
        }
        if (err._message === 'employment validation failed') {
            return utils.sendSuccessResponse(res, ({ 'error': true, 'message': err.message }))
        }
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// edit profile

exports.editProfile = async(req, res) => {
    try {
        const doc = await employmentSchema.findOne({ _id: req.user._id })
        if (!doc) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Employee not found...' })
        }

        doc.stageName = req.body.stageName
        doc.mobile = req.body.mobile
        doc.address = req.body.address
        doc.postcodeId = req.body.postcodeId
        doc.stateId = req.body.stateId
        doc.latitude = req.body.latitude
        doc.longitude = req.body.longitude
        doc.facebook = req.body.facebook
        doc.instagram = req.body.instagram
        doc.facebookEmail = req.body.facebookEmail
        doc.instagramEmail = req.body.instagramEmail
        doc.gender = req.body.gender
        doc.dob = req.body.dob
        doc.RSA = req.body.RSA
        doc.hairColor = req.body.hairColor
        doc.profilePhoto = req.body.profilePhoto
        doc.biography = req.body.biography
        doc.bankName = req.body.bankName
        doc.accountHolderName = req.body.accountHolderName
        doc.BSB = req.body.BSB
        doc.accountNumber = req.body.accountNumber
        doc.yourSpeciality = req.body.yourSpeciality
        doc.serviceCategory = req.body.serviceCategory
        doc.serviceSubCategory = req.body.serviceSubCategory
        doc.termConditionEmail = req.body.termConditionEmail
        doc.termConditionAccept = req.body.termConditionAccept
        doc.guidelines = req.body.guidelines
        doc.paymentTermsTravelRates = req.body.paymentTermsTravelRates

        const a = await doc.save()
        return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Profile updated successfully...' })
    } catch (err) {
        if (err.code == 11000) {
            return utils.sendSuccessResponse(res, ({ 'error': true, 'message': 'Mobile number already registered...' }))
        }
        if (err._message === 'employment validation failed') {
            return utils.sendSuccessResponse(res, ({ 'error': true, 'message': err.message }))
        }
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// change  employee status

exports.changeStatus = async(req, res) => {
    try {
        const response = await employmentService.changeStatus(req.user, req.body.status)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// services offered

exports.servicesOffered = async(req, res) => {
    try {
        const response = await employmentService.servicesOffered(req.user._id, req.user.gender)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// surcharge testing

exports.surcharge = async(req, res) => {
    try {
        const response = await employmentService.surcharge(req)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// update employee services

exports.updateServices = async(req, res) => {
    try {
        const response = await employmentService.updateServices(req.user._id, req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// add event surcharge

exports.addEventSurcharge = async(req, res) => {
    try {
        const response = await employmentService.addEventSurcharge(req.user._id, req.params.eventid, req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get employee event surcgarge

exports.employeeEventSurcharge = async(req, res) => {
    try {
        const response = await employmentService.employeeEventSurcharge(req.user._id)
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Employee event not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'eventSurcharge': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// update notes

exports.updateNotes = async(req, res) => {
    try {
        const response = await employmentService.updateNotes(req.user._id, req.type, req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get notes

exports.notes = async(req, res) => {
    try {
        const response = await employmentService.notes(req.user._id)
        if (!response) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Notes not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'message': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// add profile photo

exports.addProfilePhoto = async(req, res) => {
    try {
        req.imagePath = 'images/profilephoto';
        const up = utilss.upl.array('profilephoto', 4)
        up(req, res, async(err) => {
            try {
                if (err instanceof multer.MulterError) {
                    if (err.code === "LIMIT_UNEXPECTED_FILE") { // Too many images exceeding the allowed limit
                        return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please upload upto 4 images...' })
                    }
                    if (err.code === "LIMIT_FILE_SIZE") {
                        return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Image size should not be more than 2mb..' })
                    }
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Some error occur in uploading images...' })
                } else if (err) {
                    // An unknown error occurred when uploading.
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': err.message })
                }
                if (req.files == undefined || !req.files.length) {
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please select image...' })
                }
                const query = { '_id': req.user._id }

                const newvalues = []
                req.files.forEach(element => {
                    newvalues.push(normalize(element.path))
                })
                const options = { new: true }
                const up = await employmentSchema.updateOne(query, { $push: { 'profilePhoto': { $each: newvalues } } }, options)
                if (up.nModified == 0) {
                    req.files.forEach(element => {
                        fs.unlinkSync(normalize(element.path))
                    })
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Some error occur...' })
                }
                return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Successfully updated...' })
            } catch (err) {
                return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
            }
        })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// add private booking

exports.addPrivateBooking = async(req, res) => {
    try {
        const response = await employmentService.addPrivateBooking(req.user._id, req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// private booking history

exports.privateBooking = async(req, res) => {
    try {
        const response = await employmentService.privateBooking(req.user._id)
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Record not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'message': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// check employee availability

exports.checkEmployeeAvailability = async(req, res) => {
    try {
        const response = await employmentService.checkEmployeeAvailability(req.body.employeeId, req.body.dateTime)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// checkout

exports.checkout = async(req, res) => {
    try {
        const response = await employmentService.checkout(req.user._id, req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        if (err._message === 'order validation failed') {
            return utils.sendSuccessResponse(res, ({ 'error': true, 'message': err.message }))
        }
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// employee job history

exports.jobHistory = async(req, res) => {
    try {
        const response = await employmentService.jobHistory(req.user._id)
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Record not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'jobHistory': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}