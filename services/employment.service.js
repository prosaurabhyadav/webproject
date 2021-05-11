const moment = require('moment');
const stateSchema = require('../models/state.model');
const statePostcodeSchema = require('../models/state.postcode.model');
const employmentSchema = require('../models/employment.model');
const employmentEventSurchargeSchema = require('../models/employee.eventsurcharge.model');
const agencyHomeService = require('../services/agency.home.service');
const employeeSurchargeSchema = require('../models/employee.surcharge.model');
const notesSchema = require('../models/notes.model');
const privateBookingSchema = require('../models/privatebooking.model');
const orderSchema = require('../models/order.model');

// find employment detail using email address

const emailData = async(email) => {
    return (await employmentSchema.findOne({ email: email }))
}

// find employment detail using mobile number

const mobileData = async(mobile) => {
    return (await employmentSchema.findOne({ mobile: mobile }))
}

// get state name

exports.stateName = async() => {
    return (await stateSchema.find().select(['-createdAt', '-updatedAt']))
}

// get state postcode

exports.statePostcode = async(stateId) => {
    return (await statePostcodeSchema.find({ stateId: stateId }).select(['-createdAt', '-updatedAt']))
}

// check email address

exports.checkEmail = async(email) => {
    if (!email) {
        return ({ 'error': true, 'message': 'Please fill email address...' })
    }
    const emailDetail = await emailData(email)
    if (emailDetail) {
        return ({ 'error': true, 'message': 'Email already registered...' })
    }
    return ({ 'error': false, 'message': 'Valid email address...' })
}

// check mobile number

exports.checkMobile = async(mobile) => {
    if (!mobile) {
        return ({ 'error': true, 'message': 'Please fill mobile number...' })
    }
    const mobileDetail = await mobileData(mobile)
    if (mobileDetail) {
        return ({ 'error': true, 'message': 'Mobile number already registered...' })
    }
    return ({ 'error': false, 'message': 'Valid mobile number...' })
}

// change employee status

exports.changeStatus = async(user, status) => {
    const query = { '_id': user._id };
    const obj = {
        status: status
    }
    const newvalues = { $set: obj };
    const options = { new: true };
    const updateDetail = await employmentSchema.updateOne(query, newvalues, options)
    if (updateDetail.nModified == 0) {
        return ({ 'error': true, 'message': 'Some error occur...' })
    }
    return ({ 'error': false, 'message': 'Employee status changed successfully...' })
}

// services offered

exports.servicesOffered = async(employeeId, gender) => {
    const allServices = await agencyHomeService.da(gender)
    const servicesOffered = await employeeSurchargeSchema.find({ 'employeeId': employeeId }).select(['-employeeId', '-createdAt', '-updatedAt'])
    return ({ 'error': false, 'allServices': allServices, 'servicesOffered': servicesOffered })
}

// surcharge testing

exports.surcharge = async(data) => {
    let sur = ''
    const surchargeData = []
    data.body.ur.forEach(element => {
        sur = {
            employeeId: '602a18e03c72a71ac43f3a53',
            serviceCategoryId: element.categoryId,
            serviceSubCategoryId: element.subCategoryId,
            serviceSurcharge: element.serviceSurcharge
        }
        surchargeData.push(sur)
    })

    const da = await employeeSurchargeSchema.insertMany(surchargeData)
    return ({ 'message': 'Success' })
}

// update employee services

exports.updateServices = async(employeeId, data) => {
    if (!data.serviceCategoryId.length || !data.serviceSubCategoryId.length) {
        return ({ 'error': true, 'message': 'Please select services...' })
    }
    if (data.serviceSubCategoryId.length != data.serviceSurcharge.length) {
        return ({ 'error': true, 'message': 'Please select all surcharges of selected services...' })
    }
    const query = { '_id': employeeId };
    const obj = {
        'serviceCategory': data.serviceCategoryId,
        'serviceSubCategory': data.serviceSubCategoryId
    }
    const newvalues = { $set: obj };
    const options = { new: true };
    const updateDetail = await employmentSchema.updateOne(query, newvalues, options)
    if (updateDetail.nModified == 0) {
        return ({ 'error': true, 'message': 'Some error occur in updating services...' })
    }

    const deleteDetail = await employeeSurchargeSchema.deleteMany({ 'employeeId': employeeId })
    const surchargeData = []
    let sur = {}

    data.serviceSurcharge.forEach(element => {
        sur = {
            employeeId: employeeId,
            serviceCategoryId: element.categoryId,
            serviceSubCategoryId: element.subCategoryId,
            serviceSurcharge: element.serviceSurcharge
        }
        surchargeData.push(sur)
    })
    const da = await employeeSurchargeSchema.insertMany(surchargeData)
    return ({ 'error': false, 'message': 'Successfully updated...' })
}

// add event surcharge

exports.addEventSurcharge = async(employeeId, eventId, data) => {
    const query = {
        'employeeId': employeeId,
        'eventId': data.eventId
    };
    const obj = {
        employeeId: employeeId,
        eventId: eventId,
        eventSurcharge: data.eventSurcharge
    }
    const newvalues = { $set: obj };
    const options = { new: true, upsert: true };
    const updateDetail = await employmentEventSurchargeSchema.updateOne(query, newvalues, options)
    if (updateDetail.nModified == 0 && !updateDetail.upserted.length) {
        return ({ 'error': true, 'message': 'Some error occur...' })
    }
    return ({ 'error': false, 'message': 'Event surcharge updated successfully...' })
}

// get employee event surcgarge

exports.employeeEventSurcharge = async(employeeId) => {
    return (await employmentEventSurchargeSchema.find({ employeeId: employeeId }).select(['-employeeId', '-createdAt', '-updatedAt']))
}

// update notes

exports.updateNotes = async(employeeId, type, data) => {
    if (!data.notes) {
        return ({ 'error': true, 'message': 'Please fill notes...' })
    }
    const notesDetail = await notesSchema.findOne({ userId: employeeId })

    const obj = {
        userId: employeeId,
        userType: type,
        userNotes: data.notes
    }
    if (notesDetail) {
        const query = {
            'userId': employeeId
        };
        const newvalues = { $set: obj };
        const options = { new: true };
        const updateDetail = await notesSchema.updateOne(query, newvalues, options)
        if (updateDetail.nModified == 0) {
            return ({ 'error': true, 'message': 'Some error occur...' })
        }
        return ({ 'error': false, 'message': 'Notes updated successfully...' })
    }
    await notesSchema.create(obj)
    return ({ 'error': false, 'message': 'Notes updated successfully...' })
}

// get notes

exports.notes = async(employeeId) => {
    return (await notesSchema.findOne({ userId: employeeId }, 'userNotes'))
}

// add private booking

exports.addPrivateBooking = async(employeeId, data) => {
    if (!data.startDateAndTime) {
        return ({ 'error': true, 'message': 'Please select start date and time...' })
    }
    if (!data.stopDateAndTime) {
        return ({ 'error': true, 'message': 'Please select stop date and time...' })
    }
    if (!data.scheduleNote) {
        return ({ 'error': true, 'message': 'Please fill schedule note...' })
    }
    const startDate = moment(data.stopDateAndTime).isBefore(data.startDateAndTime)
    if (startDate) {
        return ({ 'error': true, 'message': 'Please select stop date after selected start date and time or select stop date as same start date and time...' })
    }
    const privateBookingData = new privateBookingSchema({
        employeeId: employeeId,
        startDateAndTime: data.startDateAndTime,
        stopDateAndTime: data.stopDateAndTime,
        scheduleNote: data.scheduleNote
    })
    const dataa = await privateBookingData.save()
    return ({ 'error': false, 'message': 'Schedule added successfully...' })
}

// private booking history

exports.privateBooking = async(employeeId) => {
    const privateBookingData = await privateBookingSchema.find({ employeeId: employeeId }).select(['-employeeId', '-createdAt', '-updatedAt'])
    const data = []
    let d = {}
    privateBookingData.forEach(element => {
        // element.toJSON().startDateAndTime = moment(element.startDateAndTime).format('YYYY/MM/DD hh:mm:ss a')
        // d.push(da)
        d = {
            '_id': element._id,
            'note': element.scheduleNote,
            'startDate': moment(element.startDateAndTime).format('YYYY/MM/DD hh:mm:ss a'),
            'stopDate': moment(element.stopDateAndTime).format('YYYY/MM/DD hh:mm:ss a')
        }
        data.push(d)
    })
    return data
}

// check employee availability

exports.checkEmployeeAvailability = async(employeeId, dateTime) => {
    const data = await orderSchema.find({
        'employeeId': employeeId,
        'startDateTime': {
            $gte: new Date(dateTime),
        },
        // 'endDateTime': {
        //     $lte: new Date(dateTime),
        // }
    })
    return ({ 'error': false, 'message': data })
}

// checkout

exports.checkout = async(userId, data) => {
    const geoLocation = { 'type': 'Point', 'coordinates': [data.longitude, data.latitude] }
    const checkoutDetail = new orderSchema({
        orderId: 'SG-' + Date.now(),
        employeeId: data.employeeId,
        userId: userId,
        serviceCategoryId: data.serviceCategoryId,
        serviceSubCategoryId: data.serviceSubCategoryId,
        servicePrice: data.servicePrice,
        adminShare: data.adminShare,
        travellingAllowance: data.travellingAllowance,
        serviceDuration: data.serviceDuration,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        serviceAddress: data.serviceAddress,
        location: geoLocation,
        promocode: data.promocode,
        eventId: data.eventId,
        eventPrice: data.eventPrice
    })
    const dataa = await checkoutDetail.save()
    return ({ 'error': false, 'message': 'Successfully ordered...' })
}

// employee job history

exports.jobHistory = async(employeeId) => {
    const jobHistoryData = await orderSchema.find({ employeeId: employeeId }).select(['orderId', 'userId', 'startDateTime', 'orderStatus'])
    const data = []
    let d = {}
    jobHistoryData.forEach(element => {
        d = {
            '_id': element._id,
            'userId': element.userId,
            'orderId': element.orderId,
            'date': moment(element.startDateTime).format('MM/DD/YYYY hh:mm:ss a'),
            'orderStatus': element.orderStatus,
        }
        data.push(d)
    })
    return data
}