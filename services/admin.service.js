const cryptoRandomString = require('crypto-random-string');
const moment = require('moment');
const auth = require('../middlewares/authentication');
const utils = require('../utils/utils');
const categorySchema = require('../models/category.model');
const subCategorySchema = require('../models/subcategory.model');
const profileDataSchema = require('../models/profiledata.model');
const subCategoryDetailSchema = require('../models/subcategorydetail.model');
const descriptionSchema = require('../models/description.model');
const promocodeSchema = require('../models/promocode.model');
const emailTemplateSchema = require('../models/email.template.model');
const agencySchema = require('../models/agency.model');
const emailGroupSchema = require('../models/email.group.model');
const adminSchema = require('../models/admin.model');
const employmentSchema = require('../models/employment.model');

// check username

const checkUsername = async(username) => {
    return (await adminSchema.findOne({ username: username }).select(['-createdAt', '-updatedAt']))
}

// check email address

const checkEmail = async(email) => {
    return (await adminSchema.findOne({ email: email }).select(['-createdAt', '-updatedAt']))
}

// agency all email address

const agencyEmail = async() => {
    const allEmail = []
    const data = await agencySchema.find().select('email')
    if (data.length) {
        data.forEach(element => {
            allEmail.push(element.email)
        })
    }
    return allEmail
}

// employment all email address

const employmentEmail = async() => {
    const allEmail = []
    const data = await employmentSchema.find().select('email')
    if (data.length) {
        data.forEach(element => {
            allEmail.push(element.email)
        })
    }
    return allEmail
}

// admin login

exports.adminLogin = async(username, password) => {
    const adminDetail = await checkUsername(username)
    if (!adminDetail) {
        return ({ 'error': true, 'message': 'Wrong username...' })
    }

    const valid = adminDetail.comparePassword(password, adminDetail.password)
    if (!valid) {
        return ({ 'error': true, 'message': 'Wrong password...' })
    }
    const adminTokenData = { 'userId': adminDetail._id, 'type': 'admin' }
    const token = await auth.newGenerateAccessToken(adminTokenData)
        // const admin = await auth.setData(adminDetail)

    return ({ 'error': false, 'message': 'Login successfully...', 'token': token })
}

// forgot password

exports.forgotPassword = async(email) => {
    const adminData = await checkEmail(email)

    if (!adminData) {
        return ({ 'error': true, 'message': 'Wrong email address entered, Please enter your registered email address...' })
    }
    const password = cryptoRandomString({ length: 6, type: 'alphanumeric' });
    const encryptPassword = adminData.encryptPassword(password)

    const query = { '_id': adminData._id }
    const obj = { password: encryptPassword }
    const newvalues = { $set: obj }
    const options = { new: true }

    const detail = await adminSchema.updateOne(query, newvalues, options)
    if (detail.nModified == 0) {
        return ({ 'error': true, 'message': 'Some error occur...' })
    }
    const subject = "Welcome to StripperGram";
    const message = '<p>Hello ' + adminData.username + ',</p>' + '<p>Your password is:' + password + '</p>';

    await utils.sendotpemail(adminData.email, subject, message);
    return ({ 'error': false, 'message': 'Password sent to your email-id ' + adminData.email });
}

// change user

exports.changeUser = async(adminId, data) => {
    if (!data.username) {
        return ({ 'error': true, 'message': 'Please fill username...' })
    }
    if (!data.email) {
        return ({ 'error': true, 'message': 'Please fill email...' })
    }
    const query = { '_id': adminId }
    const obj = {
        username: data.username,
        email: data.email
    }
    const newvalues = { $set: obj }
    const options = { new: true }

    const detail = await adminSchema.updateOne(query, newvalues, options)
    if (detail.nModified == 0) {
        return ({ 'error': true, 'message': 'Some error occur...' })
    }
    return ({ 'error': false, 'message': 'Updated successfully...' })
}

// admin profile

exports.profile = async(user) => {
    if (!user) {
        return ({ 'error': true, 'message': 'Invalid user...' })
    }
    return ({ 'error': false, 'data': user })
}

// update password

exports.updatePassword = async(adminId, data) => {
    const currentPassword = data.currentPassword;
    const newPassword = data.newPassword;
    const confirmPassword = data.confirmPassword;
    const trimPassword = newPassword.replace(/\s+/g, '')

    if (!currentPassword) {
        return ({ 'error': true, 'message': 'Please fill current password...' })
    }
    if (!newPassword) {
        return ({ 'error': true, 'message': 'Please fill new password...' })
    }
    if (!confirmPassword) {
        return ({ 'error': true, 'message': 'Please fill confirm password...' })
    }

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

    const admin = await adminSchema.findOne({ _id: adminId })

    if (!admin) {
        return ({ 'error': true, 'message': 'Admin not found...' })
    }
    const valid = admin.comparePassword(currentPassword, admin.password)

    if (!valid) {
        return ({ 'error': true, 'message': 'Your current password is wrong...' })
    } else {
        const newPaswwordValid = admin.comparePassword(newPassword, admin.password)
        if (newPaswwordValid) {
            return ({ 'error': true, 'message': 'Your new password cannot be same as last password...' })
        }
        const password = admin.encryptPassword(trimPassword)
        const query = { '_id': adminId }
        const obj = { password: password }
        const newvalues = { $set: obj }
        const options = { new: true }

        const detail = await adminSchema.updateOne(query, newvalues, options)
        if (detail.nModified == 0) {
            return ({ 'error': true, 'message': 'Some error occur in updating password...' })
        }
        return ({ 'error': false, 'message': 'Password updated successfully...' })
    }
}

// add category

exports.addCategory = async(data) => {
    if (!data.body.categoryName) {
        return ({ 'error': true, 'message': 'Please fill category name...' })
    }
    if (!data.body.gender) {
        return ({ 'error': true, 'message': 'Please select gender...' })
    }

    const categoryDetail = new categorySchema({
        categoryName: data.body.categoryName,
        gender: data.body.gender
    })
    await categoryDetail.save()
    return ({ 'error': false, 'message': 'Category added successfully...' })
}

// get category name by gender

exports.getCategoryByGender = async(gender) => {
    return (await categorySchema.find({ gender: gender }).select(['-createdAt', '-updatedAt']))
}

// edit category

exports.editCategory = async(categoryid, categoryName) => {
    if (!categoryName) {
        return ({ 'error': true, 'message': 'Please fill category name...' })
    }

    const query = { '_id': categoryid }
    const obj = { categoryName: categoryName }
    const newvalues = { $set: obj }
    const options = { new: true }

    const detail = await categorySchema.updateOne(query, newvalues, options)
    if (detail.nModified == 0) {
        return ({ 'error': true, 'message': 'Some error occur in updating category...' })
    }
    return ({ 'error': false, 'message': 'Category updated successfully...' })
}

// add sub-category

exports.addSubCategory = async(data, categoryId) => {
    if (!data.subCategoryName) {
        return ({ 'error': true, 'message': 'Please fill sub-category name...' })
    }
    if (!data.servicePricePerHour) {
        return ({ 'error': true, 'message': 'Please fill service price per hour...' })
    }
    if (!data.strippergramSharePerHour) {
        return ({ 'error': true, 'message': 'Please fill strippergram share per hour...' })
    }
    if (!data.serviceDuration) {
        return ({ 'error': true, 'message': 'Please select service duration...' })
    }
    if (!data.gender) {
        return ({ 'error': true, 'message': 'Please select gender...' })
    }

    const subCategoryDetail = new subCategorySchema({
        categoryId: categoryId,
        subCategoryName: data.subCategoryName,
        servicePricePerHour: data.servicePricePerHour,
        strippergramSharePerHour: data.strippergramSharePerHour,
        serviceDuration: data.serviceDuration,
        gender: data.gender
    })
    await subCategoryDetail.save()
    return ({ 'error': false, 'message': 'Sub-category added successfully...' })
}

// get sub-category name by category id

exports.getSubCategoryName = async(categoryid) => {
    return (await subCategorySchema.find({ categoryId: categoryid }))
}

// get sub-category detail by sub-categoryid

exports.subCategoryById = async(subCategoryid) => {
    return (await subCategorySchema.find({ _id: subCategoryid }))
}

// edit sub-category

exports.editSubCategory = async(data) => {
    if (!data.body.subCategoryName || !data.body.servicePricePerHour || !data.body.strippergramSharePerHour || !data.body.serviceDuration) {
        return ({ 'error': true, 'message': 'Please fill all fields...' })
    }

    const query = { '_id': data.params.subcategoryid }
    const obj = {
        subCategoryName: data.body.subCategoryName,
        servicePricePerHour: data.body.servicePricePerHour,
        strippergramSharePerHour: data.body.strippergramSharePerHour,
        serviceDuration: data.body.serviceDuration,
        // gender: data.body.gender
    }
    const newvalues = { $set: obj }
    const options = { new: true }

    const detail = await subCategorySchema.updateOne(query, newvalues, options)
    if (detail.nModified == 0) {
        return ({ 'error': true, 'message': 'Some error occur in updating sub-category...' })
    }
    return ({ 'error': false, 'message': 'Sub-category updated successfully...' })
}

// delete sub-category

exports.deleteSubCategory = async(subcategoryid) => {
    return (await subCategorySchema.deleteOne({ _id: subcategoryid }))
}

// get profile data by gender

exports.getProfileDataByGender = async(gender) => {
    return (await profileDataSchema.find({ gender: gender }))
}

// get sub-category detail

exports.getSubCategoryDetail = async() => {
    return (await subCategoryDetailSchema.find().select(['-createdAt', '-updatedAt']))
}

// get sub-category detail by sub-categoryid

exports.getSubCategoryDetailById = async(subCategoryId) => {
    return (await subCategoryDetailSchema.findOne({ _id: subCategoryId }).select(['-createdAt', '-updatedAt']))
}

// add description

exports.addDescription = async(data) => {
    const descriptionDetail = new descriptionSchema({
        type: data.type,
        title: data.title,
        description: data.description,
        specialCharacter: data.specialCharacter,
        specialCharacterStatus: data.specialCharacterStatus
    })
    await descriptionDetail.save();
    return ({ 'error': false, 'message': 'Description added successfully...' })
}

// get description by description type

exports.getDescription = async(descriptionType) => {
    return (await descriptionSchema.findOne({ type: descriptionType }).select(['-createdAt', '-updatedAt']))
}

// edit description

exports.editDescription = async(descriptionId, data) => {
    if (!data.title || !data.description) {
        return ({ 'error': true, 'message': 'Please fill all fields...' })
    }
    if (!data.specialCharacterStatus) {
        data.specialCharacterStatus = '0'
    }
    const query = { '_id': descriptionId }
    const obj = {
        // type: data.type,
        title: data.title,
        description: data.description,
        specialCharacter: data.specialCharacter,
        specialCharacterStatus: data.specialCharacterStatus
    }
    const newvalues = { $set: obj }
    const options = { new: true }

    const detail = await descriptionSchema.updateOne(query, newvalues, options)
    if (detail.nModified == 0) {
        return ({ 'error': true, 'message': 'Some error occur in updating description...' })
    }
    return ({ 'error': false, 'message': 'Description updated successfully...' })
}

// add promocode

exports.addPromocode = async(data) => {
    if (!data.promocode || !data.discount) {
        return ({ 'error': true, 'message': 'Please fill all fields...' })
    }
    const promocodeDetail = new promocodeSchema({
        promocode: data.promocode,
        discount: data.discount
    })
    await promocodeDetail.save()
    return ({ 'error': false, 'message': 'Promocode added successfully...' })
}

// get promocode

exports.promocodeList = async() => {
    return (await promocodeSchema.find().select(['-createdAt', '-updatedAt']))
}

// edit promocode

exports.editPromocode = async(promocodeId, data) => {
    if (!data.promocode || !data.discount) {
        return ({ 'error': true, 'message': 'Please fill all fields...' })
    }

    const query = { '_id': promocodeId }
    const obj = {
        promocode: data.promocode,
        discount: data.discount
    }
    const newvalues = { $set: obj }
    const options = { new: true }

    const detail = await promocodeSchema.updateOne(query, newvalues, options)
    if (detail.nModified == 0) {
        return ({ 'error': true, 'message': 'Some error occur in updating promocode...' })
    }
    return ({ 'error': false, 'message': 'Promocode updated successfully...' })
}

// delete promocode

exports.deletePromocode = async(promocodeId) => {
    return (await promocodeSchema.deleteOne({ _id: promocodeId }))
}

// delete all promocode

exports.deleteAllPromocode = async() => {
    return (await promocodeSchema.deleteMany())
}

// add email template

exports.addEmailTemplate = async(data) => {
    if (!data.name || !data.title || !data.subject || !data.body) {
        return ({ 'error': true, 'message': 'Please fill all fields...' })
    }
    const emailTemplateDetail = new emailTemplateSchema({
        name: data.name,
        title: data.title,
        subject: data.subject,
        body: data.body,
        // subjectAdmin: data.subjectAdmin,
        // bodyAdmin: data.bodyAdmin
    })
    await emailTemplateDetail.save()
    return ({ 'error': false, 'message': 'Email template added successfully...' })
}

// get email template by template name

exports.getemailTemplate = async(templateName) => {
    return (await emailTemplateSchema.findOne({ name: templateName }).select(['-createdAt', '-updatedAt']))
}

// edit email template

exports.editEmailTemplate = async(emailTemplateId, data) => {
    if (!data.title || !data.body) {
        return ({ 'error': true, 'message': 'Please fill all fields...' })
    }

    const query = { '_id': emailTemplateId }
    const obj = {
        // name: data.name,
        title: data.title,
        // subject: data.subject,
        body: data.body,
        // subjectAdmin: data.subjectAdmin,
        // bodyAdmin: data.bodyAdmin
    }
    const newvalues = { $set: obj }
    const options = { new: true }

    const detail = await emailTemplateSchema.updateOne(query, newvalues, options)
    if (detail.nModified == 0) {
        return ({ 'error': true, 'message': 'Some error occur in updating email template...' })
    }
    return ({ 'error': false, 'message': 'Email template updated successfully...' })
}

// dashboard

exports.dashboard = async() => {
    return (await agencySchema.find())
}

// create email group

exports.createEmailGroup = async(data) => {
    if (!data.userType || !data.title || !data.emailAddress.length) {
        return ({ 'error': true, 'message': 'Please fill all fields...' })
    }
    const emailGroupDetail = new emailGroupSchema({
        userType: data.userType,
        title: data.title,
        emailAddress: data.emailAddress
    })
    await emailGroupDetail.save()
    return ({ 'error': false, 'message': 'Email group added successfully...' })
}

// get email group

exports.getEmailGroup = async() => {
    return (await emailGroupSchema.find().select(['-updatedAt']))
}

// get emails from email group

exports.getEmail = async(emailGroupId) => {
    return (await emailGroupSchema.findOne({ _id: emailGroupId }).select('emailAddress'))
}

// send mail to group

exports.sendMailToGroup = async(data, emailGroupId) => {
    if (!data.emailSubject || !data.emailBody) {
        return ({ 'error': true, 'message': 'Please fill all fields...' })
    }
    const groupData = await emailGroupSchema.findOne({ _id: emailGroupId })
    if (!groupData) {
        return ({ 'error': true, 'message': 'Group not found...' })
    }
    const emailAddress = groupData.emailAddress
    const subject = data.emailSubject;
    const message = data.emailBody;
    await utils.sendotpemail(emailAddress, subject, message);
    return ({ 'error': false, 'message': 'Mail send successfully...' })
}

// send mail to multi-user

exports.sendMailToMultiuser = async(data) => {
    if (!data.emailAddress || !data.emailSubject || !data.emailBody) {
        return ({ 'error': true, 'message': 'Please fill all fields...' })
    }
    const emailAddress = data.emailAddress
    const subject = data.emailSubject;
    const message = data.emailBody;
    await utils.sendotpemail(emailAddress, subject, message);
    return ({ 'error': false, 'message': 'Mail send successfully...' })
}

// all email address

exports.allEmail = async() => {
    const agency = await agencyEmail()
    const employment = await employmentEmail()
    const allEmail = agency.concat(employment)
    return allEmail
}

// all agency email address

exports.agencyAllEmail = async() => {
    return (await agencyEmail())
}

// all employment email address

exports.employmentAllEmail = async() => {
    return (await employmentEmail())
}

// email list

exports.emailList = async(userType) => {
    if (userType == 'agency') {
        const allAgencyEmail = await agencyEmail()
        if (!allAgencyEmail.length) {
            return ({ 'error': true, 'message': 'Email not found...' })
        }
        return ({ 'error': false, 'email': allAgencyEmail })
    } else if (userType == 'employment') {
        const allEmployeeEmail = await employmentEmail()
        if (!allEmployeeEmail.length) {
            return ({ 'error': true, 'message': 'Email not found...' })
        }
        return ({ 'error': false, 'email': allEmployeeEmail })
    } else {
        return ({ 'error': true, 'message': 'Invalid user type...' })
    }
}

// email list for both user type or single user type

exports.demo = async(data) => {
    if (data.usertype2) {
        if (data.usertype2 == 'agency' || data.usertype2 == 'employment') {
            if (data.usertype1 == 'agency' || data.usertype1 == 'employment') {
                if ((data.usertype1 == 'agency' && data.usertype2 == 'agency') || (data.usertype1 == 'employment' && data.usertype2 == 'employment')) {
                    return ({ 'error': true, 'message': 'Both user type cannot be same...' })
                }
                const allAgencyEmail = await agencyEmail()
                const allEmployeeEmail = await employmentEmail()
                allEmail = allAgencyEmail.concat(allEmployeeEmail)
                return ({ 'error': false, 'email': allEmail })
            } else {
                return ({ 'error': true, 'message': 'Invalid user type...' })
            }
        } else {
            return ({ 'error': true, 'message': 'Invalid user type...' })
        }
    }
    if (data.usertype1 == 'agency') {
        const allAgencyEmail = await agencyEmail()
        if (!allAgencyEmail.length) {
            return ({ 'error': true, 'message': 'Email not found...' })
        }
        return ({ 'error': false, 'email': allAgencyEmail })
    } else if (data.usertype1 == 'employment') {
        const allEmployeeEmail = await employmentEmail()
        if (!allEmployeeEmail.length) {
            return ({ 'error': true, 'message': 'Email not found...' })
        }
        return ({ 'error': false, 'email': allEmployeeEmail })
    } else {
        return ({ 'error': true, 'message': 'Invalid user type...' })
    }
}

// registered user

// const allAgent = async() => {
//     return (await agencySchema.find().select(['-licenseORpassport', '-utilityBilORMedicardeORCreditCard']))
// }

exports.registeredUser = async(userType) => {
    if (userType == 'agency') {
        const agencyData = await agencySchema.find().select(['fullname', 'email', 'mobile', 'createdAt'])
        if (!agencyData.length) {
            return ({ 'error': true, 'message': 'Record not found...' })
        }
        const data = []
        let d = {}
        agencyData.forEach(element => {
            d = {
                '_id': element._id,
                'fullname': element.fullname,
                'email': element.email,
                'mobile': element.mobile,
                'addedDate': moment(element.createdAt).format('DD-MM-YYYY')
            }
            data.push(d)
        })
        return ({ 'error': false, 'data': data })
    } else if (userType == 'employment') {
        const employmentData = await employmentSchema.find()
            .select(['firstname', 'lastname', 'email', 'mobile', 'postcodeId', 'createdAt'])
            .populate({ 'path': 'postcodeId', select: 'postcode' })
        if (!employmentData.length) {
            return ({ 'error': true, 'message': 'Record not found...' })
        }
        const data = []
        let d = {}
        employmentData.forEach(element => {
            d = {
                '_id': element._id,
                'firstname': element.firstname,
                'lastname': element.lastname,
                'email': element.email,
                'mobile': element.mobile,
                'postcode': element.postcodeId.postcode,
                'addedDate': moment(element.createdAt).format('DD-MM-YYYY')
            }
            data.push(d)
        })
        return ({ 'error': false, 'data': data })
    } else {
        return ({ 'error': true, 'message': 'Invalid user type...' })
    }
}

// agency detail

exports.agencyDetail = async(agencyId) => {
    const agencyData = await agencySchema.findOne({ _id: agencyId }).select(['-tokens', '-password', '-licenseORpassport', '-utilityBilORMedicardeORCreditCard', '-updatedAt'])
    if (!agencyData) {
        return ({ 'error': true, 'message': 'Agent not found...' })
    }
    const data = agencyData.toJSON()
    data.registrationDate = moment(data.createdAt).format('DD MMMM YYYY hh:mm:ss')
    delete data.createdAt
    return ({ 'error': false, 'agentDetail': data })
}

// edit agency detail

exports.editAgency = async(agencyId, data) => {
    if (!data.fullname || !data.address || !data.ABNNumber || !data.bankName || !data.BSB || !data.accountNumber) {
        return ({ 'error': true, 'message': 'Please fill all fields...' })
    }

    const query = { '_id': agencyId };
    const obj = {
        fullname: data.fullname,
        address: data.address,
        ABNNumber: data.ABNNumber,
        bankName: data.bankName,
        BSB: data.BSB,
        accountNumber: data.accountNumber
    }
    const newvalues = { $set: obj };
    const options = { new: true };
    const agency = await agencySchema.updateOne(query, newvalues, options)
    if (agency.nModified == 0) {
        return ({ 'error': true, 'message': 'Some error occur in updating field...' })
    }
    return ({ 'error': false, 'message': 'Updated successfully...' })
}

// delete agent

exports.deleteAgent = async(agencyId) => {
    return (await agencySchema.deleteOne({ _id: agencyId }))
}

// employee detail

exports.employeeDetail = async(employeeId) => {
    const employeeData = await employmentSchema.findOne({ _id: employeeId })
        .select(['-latitude', '-longitude', '-tokens', '-password', '-licenseORpassport', '-utilityBilORMedicardeORCreditCard', '-status', '-updatedAt'])
        .populate({ 'path': 'postcodeId', 'select': 'postcode' })
        .populate({ 'path': 'stateId', 'select': 'stateName' })
    if (!employeeData) {
        return ({ 'error': true, 'message': 'Employee not found...' })
    }
    const data = employeeData.toJSON()
    data.dob = moment(data.createdAt).format('DD-MM-YYYY')
    data.registrationDate = moment(data.createdAt).format('DD MMMM YYYY hh:mm:ss')
    delete data.createdAt
    return ({ 'error': false, 'agentDetail': data })
}

// edit employee detail

// exports.editEmployee = async(employeeId, data) => {
//     if (!data.firstname || !!data.lastname || !data.stageName || !data.address || !data.stateId || !data.postcodeId || !data.country || !data.dob || !data.facebook ||
//         !data.instagram || !data.facebookEmail || !data.instagramEmail || !data.gender || !data.hairColor || !data.RSA || !data.biography || !data.bankName ||
//         !data.accountHolderName || !data.BSB || !data.accountNumber || !data.yourSpeciality || !data.termConditionEmail || !data.termConditionAccept || !data.guidelines || !data.paymentTermsTravelRates) {
//         return ({ 'error': true, 'message': 'Please fill all fields...' })
//     }

//     const query = { '_id': employeeId };
//     const obj = {
//         firstname: data.firstname,
//         lastname: data.lastname,
//         stageName: data.stageName,
//         address: data.address,
//         postcodeId: data.postcodeId,
//         stateId: data.stateId,
//         // latitude: data.latitude,
//         // longitude: data.longitude,
//         country: data.country,
//         dob: data.dob,
//         facebook: data.facebook,
//         instagram: data.instagram,
//         facebookEmail: data.facebookEmail,
//         instagramEmail: data.instagramEmail,
//         gender: data.gender,
//         hairColor: data.hairColor,
//         RSA: data.RSA,
//         // profilePhoto: data.profilePhoto,
//         biography: data.biography,
//         bankName: data.bankName,
//         accountHolderName: data.accountHolderName,
//         BSB: data.BSB,
//         accountNumber: data.accountNumber,
//         yourSpeciality: data.yourSpeciality,
//         termConditionEmail: data.termConditionEmail,
//         termConditionAccept: data.termConditionAccept,
//         guidelines: data.guidelines,
//         paymentTermsTravelRates: data.paymentTermsTravelRates
//     }

//     const newvalues = { $set: obj };
//     const options = { new: true };
//     const agency = await employmentSchema.updateOne(query, newvalues, options)
//     if (agency.nModified == 0) {
//         return ({ 'error': true, 'message': 'Some error occur in updating field...' })
//     }
//     return ({ 'error': false, 'message': 'Updated successfully...' })
// }

// delete employee

exports.deleteEmployee = async(agencyId) => {
    return (await employmentSchema.deleteOne({ _id: agencyId }))
}