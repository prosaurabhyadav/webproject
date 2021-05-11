const multer = require('multer');
const normalize = require('normalize-path');
const moment = require('moment');
const fs = require('fs')
const cryptoRandomString = require('crypto-random-string');
const adminService = require('../services/admin.service');
const utils = require('../utils/responses');
const profileDataSchema = require('../models/profiledata.model');
const subCategoryDetailSchema = require('../models/subcategorydetail.model');
const userService = require('../services/user.service');
const ut = require('../utils/utils');
const employmentSchema = require('../models/employment.model');

// profile data storage

const Storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images/profiledata/')
    },
    filename: function(req, file, cb) {
        cb(null, cryptoRandomString({ length: 32, type: 'hex' }) + '.' + file.mimetype.split('/')[1])
    }
})

const file_filter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: Storage,
    fileFilter: file_filter
}).single('profiledata');

// subcategory detail storage

const subCategoryStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './images/subcategory/')
    },
    filename: function(req, file, cb) {
        cb(null, cryptoRandomString({ length: 32, type: 'hex' }) + '.' + file.mimetype.split('/')[1])
    }
})

const subCategory = multer({
    storage: subCategoryStorage,
    fileFilter: file_filter
}).single('subcategory');

// admin login

exports.adminLogin = async(req, res) => {
    try {
        if (!req.body.username) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill username..' })
        }
        if (!req.body.password) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill password...' })
        }
        const response = await adminService.adminLogin(req.body.username, req.body.password)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// forgot password

exports.forgotPasword = async(req, res) => {
    try {
        if (!req.body.email) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill email address..' })
        }
        const response = await adminService.forgotPassword(req.body.email)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// change user

exports.changeUser = async(req, res) => {
    try {
        const response = await adminService.changeUser(req.user._id, req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// admin profile

exports.profile = async(req, res) => {
    try {
        const response = await adminService.profile(req.user)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// update password

exports.updatePasword = async(req, res) => {
    try {
        const response = await adminService.updatePassword(req.user._id, req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}


// add categories

exports.category = async(req, res) => {
    try {
        const response = await adminService.addCategory(req)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get category name by gender

exports.categoryName = async(req, res) => {
    try {
        const response = await adminService.getCategoryByGender(req.params.gender)
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'No categories found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': true, 'category': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// edit category 

exports.editCategory = async(req, res) => {
    try {
        const response = await adminService.editCategory(req.params.categoryid, req.body.categoryName)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// add sub-category

exports.subCategory = async(req, res) => {
    try {
        const response = await adminService.addSubCategory(req.body, req.params.categoryid)
        return utils.sendSuccessResponse(res, { 'error': true, 'category': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get sub-category list by category id

exports.subCategoryName = async(req, res) => {
    try {
        const response = await adminService.getSubCategoryName(req.params.categoryid)
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'No sub-categories found...' })
        }
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get sub-category detail by sub-categoryid

exports.subCategoryById = async(req, res) => {
    try {
        const response = await adminService.subCategoryById(req.params.subcategoryid)
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'No sub-category found...' })
        }
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// edit sub-category

exports.editSubCategory = async(req, res) => {
    try {
        const response = await adminService.editSubCategory(req)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// delete sub-category

exports.deleteSubCategory = async(req, res) => {
    try {
        const response = await adminService.deleteSubCategory(req.params.subcategoryid)
        if (response.deletedCount == 0) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Sub-category not deleted...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Sub-category deleted successfully...' })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// add profile data

exports.profileData = async(req, res) => {
    try {
        upload(req, res, async(err) => {
            try {
                if (!req.file) {
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please upload image...' })
                }

                const profileDataDetail = new profileDataSchema({
                    gender: req.body.gender,
                    profilePhoto: '/' + normalize(req.file.path),
                    profileDescription: req.body.profileDescription,
                })
                await profileDataDetail.save()
                return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Profile data added successfully...' })
            } catch (err) {
                return utils.sendErrorResponse(res, 400, { 'error': true, 'message': 'Internal server error...' })
            }
        })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get profile data by gender

exports.profileDataByGender = async(req, res) => {
    try {
        const response = await adminService.getProfileDataByGender(req.params.gender)
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Profile data not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': true, 'category': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// edit profile data

exports.editProfileData = async(req, res) => {
    try {
        const profileDataDetail = await profileDataSchema.findOne({ _id: req.params.profiledataid })
        if (!profileDataDetail) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'This profile does not exist...' })
        }
        upload(req, res, async(err) => {
            try {
                if (!req.body.profileDescription) {
                    fs.unlinkSync(normalize(req.file.path))
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill profile description...' })
                }
                if (!req.file) {
                    return utils.sendSuccessResponse(res, { 'error': true, 'messasge': 'Please upload image' })
                }
                fs.unlinkSync(profileDataDetail.profilePhoto.slice(1))

                profileDataDetail.profilePhoto = '/' + normalize(req.file.path);
                profileDataDetail.profileDescription = req.body.profileDescription;
                await profileDataDetail.save()
                return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Profile data updated successfully...' })
            } catch (err) {
                if (err.code == 'ENOENT') {
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Some error occur in updating image...' })
                }
                return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
            }
        })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// add sub-category detail

exports.subCategoryDetail = async(req, res) => {
    try {
        subCategory(req, res, async(err) => {
            try {
                if (!req.file) {
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please upload image...' })
                }

                const subCategoryDetail = new subCategoryDetailSchema({
                    categoryId: req.body.categoryId,
                    subCategoryId: req.body.subCategoryId,
                    serviceName: req.body.serviceName,
                    description: req.body.description,
                    photo: '/' + normalize(req.file.path),
                    servicePrice: req.body.servicePrice,
                    strippergramShare: req.body.strippergramShare
                })
                await subCategoryDetail.save()
                return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Sub-category detail added successfully...' })
            } catch (err) {
                return utils.sendErrorResponse(res, 400, { 'error': true, 'message': 'Internal server error...' })
            }
        })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get sub-category detail

exports.getSubCategoryDetail = async(req, res) => {
    try {
        const response = await adminService.getSubCategoryDetail()
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Sub-category detail not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': true, 'category': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get sub-category detail by subcategoryid

exports.subCategoryDetailById = async(req, res) => {
    try {
        const response = await adminService.getSubCategoryDetailById(req.params.subcategoryid)
        if (!response) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Sub-category detail not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': true, 'category': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// edit sub-category detail

exports.editSubCategoryDetail = async(req, res) => {
    try {
        const subCategoryDetail = await subCategoryDetailSchema.findOne({ _id: req.params.subcategorydetailid })
        if (!subCategoryDetail) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'This sub-category does not exists...' })
        }
        subCategory(req, res, async(err) => {
            try {
                if (!req.body.serviceName || !req.body.description || !req.body.servicePrice || !req.body.strippergramShare) {
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill all details...' })
                }
                if (!req.file) {
                    const query = { '_id': req.params.subcategorydetailid }
                    const obj = {
                        serviceName: req.body.serviceName,
                        description: req.body.description,
                        servicePrice: req.body.servicePrice,
                        strippergramShare: req.body.strippergramShare
                    }
                    const newvalues = { $set: obj }
                    const options = { new: true }
                    const detail = await subCategoryDetailSchema.updateOne(query, newvalues, options)
                    if (detail.nModified == 0) {
                        return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Some error occur in updating sub-category detail...' })
                    }
                    return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Sub-category detail updated successfully...' })
                }

                fs.unlinkSync(subCategoryDetail.photo.slice(1))
                subCategoryDetail.serviceName = req.body.serviceName;
                subCategoryDetail.description = req.body.description;
                subCategoryDetail.photo = '/' + normalize(req.file.path);
                subCategoryDetail.servicePrice = req.body.servicePrice;
                subCategoryDetail.strippergramShare = req.body.strippergramShare;
                await subCategoryDetail.save()

                return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Sub-category detail updated successfully...' })
            } catch (err) {
                if (err.code == 'ENOENT') {
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Some error occur in updating image...' })
                }
                return utils.sendErrorResponse(res, 400, { 'error': true, 'message': 'Internal server error...' })
            }
        })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// add description

exports.description = async(req, res) => {
    try {
        const response = await adminService.addDescription(req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get description by description type

exports.getDescription = async(req, res) => {
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

// edit description

exports.editDescription = async(req, res) => {
    try {
        const response = await adminService.editDescription(req.params.descriptionid, req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// add promocode

exports.promocode = async(req, res) => {
    try {
        const response = await adminService.addPromocode(req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get promocode

exports.promocodeList = async(req, res) => {
    try {
        const response = await adminService.promocodeList()
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Promocode not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'promocodeList': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// edit promocode

exports.editPromocode = async(req, res) => {
    try {
        const response = await adminService.editPromocode(req.params.promocodeid, req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// delete promocode

exports.deletePromocode = async(req, res) => {
    try {
        const response = await adminService.deletePromocode(req.params.promocodeid)
        if (response.deletedCount == 0) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Promocode not deleted...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Promocode deleted successfully...' })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// delete all promocode

exports.deleteAllPromocode = async(req, res) => {
    try {
        const response = await adminService.deleteAllPromocode()
        if (response.deletedCount == 0) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Promocodes not deleted...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'message': 'All promocode deleted successfully...' })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// add email template

exports.emailTemplate = async(req, res) => {
    try {
        const response = await adminService.addEmailTemplate(req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get email template by template name

exports.getemailTemplate = async(req, res) => {
    try {
        const response = await adminService.getemailTemplate(req.params.templatename)
        if (!response) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Email template not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'emailTemplate': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// edit email template

exports.editEmailTemplate = async(req, res) => {
    try {
        const response = await adminService.editEmailTemplate(req.params.emailtemplateid, req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// admin dashboard

exports.dashboard = async(req, res) => {
    try {
        const response = await adminService.dashboard()
        return utils.sendSuccessResponse(res, { 'error': false, 'agents': response.length })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// create email group

exports.createEmailGroup = async(req, res) => {
    try {
        const response = await adminService.createEmailGroup(req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get email groups

exports.emailGroup = async(req, res) => {
    try {
        const response = await adminService.getEmailGroup()
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Email group not found...' })
        }
        const data = []
        let d = {}
        response.forEach(element => {
            d = {
                _id: element._id,
                title: element.title,
                userType: element.userType,
                emailAddress: element.emailAddress,
                date: moment(element.createdAt).format('YYYY/MM/DD hh:mm:ss')
            }
            data.push(d)
        })
        return utils.sendSuccessResponse(res, { 'error': false, 'emailGroup': data })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get emails from email group

exports.groupEmail = async(req, res) => {
    try {
        const response = await adminService.getEmail(req.params.emailgroupid)
        if (!response) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Email not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'email': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// send mail to group

exports.sendToMailGroup = async(req, res) => {
    try {
        const response = await adminService.sendMailToGroup(req.body, req.params.emailgroupid)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// send mail to multi-user

exports.sendMailToMultiuser = async(req, res) => {
    try {
        const response = await adminService.sendMailToMultiuser(req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// get all email address

exports.allEmail = async(req, res) => {
    try {
        const response = await adminService.allEmail()
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Email not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'email': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// all agency email address

exports.agencyAllEmail = async(req, res) => {
    try {
        const response = await adminService.agencyAllEmail()
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Email not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'email': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// all employment email address

exports.employmentAllEmail = async(req, res) => {
    try {
        const response = await adminService.employmentAllEmail()
        if (!response.length) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Email not found...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'email': response })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// email list

exports.emailList = async(req, res) => {
    try {
        const response = await adminService.emailList(req.params.usertype)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// email list for both user type or single user type

exports.demo = async(req, res) => {
    try {
        const response = await adminService.demo(req.params)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// registered user

exports.registeredUser = async(req, res) => {
    try {
        const response = await adminService.registeredUser(req.params.usertype)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// agency detail

exports.agencyDetail = async(req, res) => {
    try {
        const response = await adminService.agencyDetail(req.params.agencyid)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// edit agency detail

exports.editAgency = async(req, res) => {
    try {
        const response = await adminService.editAgency(req.params.agencyid, req.body)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// delete agent

exports.deleteAgent = async(req, res) => {
    try {
        const response = await adminService.deleteAgent(req.params.agencyid)
        if (response.deletedCount == 0) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Agent not deleted...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Agent deleted successfully...' })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// employee detail

exports.employeeDetail = async(req, res) => {
    try {
        const response = await adminService.employeeDetail(req.params.employeeid)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// delete employee

exports.deleteEmployee = async(req, res) => {
    try {
        const response = await adminService.deleteEmployee(req.params.employeeid)
        if (response.deletedCount == 0) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Employee not deleted...' })
        }
        return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Employee deleted successfully...' })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// admin logout

exports.logout = async(req, res) => {
    try {
        const response = await userService.logout(req)
        return utils.sendSuccessResponse(res, response)
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}

// new employee edit

exports.editEmployee = async(req, res) => {
    try {
        const dataa = await employmentSchema.findOne({ _id: req.params.employeeid })
        if (!dataa) {
            return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Employee not found...' })
        }
        req.imagePath = './images/profilephoto/'
        const im = ut.upl.single('pic')
        im(req, res, async(err) => {
            try {
                if (err instanceof multer.MulterError) {
                    // A Multer error occurred when uploading.
                    if (err.code === "LIMIT_FILE_SIZE") {
                        return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Image size should not be more than 2mb..' })
                    }
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Some error occur in uploading images...' })
                } else if (err) {
                    // An unknown error occurred when uploading.
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': err.message })
                }
                if (!req.file) {
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please upload image...' })
                }
                const data = req.body
                if (!data.firstname || !data.lastname || !data.stageName || !data.address || !data.stateId || !data.postcodeId || !data.country || !data.dob || !data.facebook ||
                    !data.instagram || !data.facebookEmail || !data.instagramEmail || !data.gender || !data.hairColor || !data.RSA || !data.biography || !data.bankName ||
                    !data.accountHolderName || !data.BSB || !data.accountNumber || !data.yourSpeciality || !data.termConditionEmail || !data.termConditionAccept || !data.guidelines || !data.paymentTermsTravelRates) {
                    return utils.sendSuccessResponse(res, { 'error': true, 'message': 'Please fill all fields...' })
                }
                fs.unlinkSync(dataa.profilePhoto[0].slice(1))

                dataa.firstname = data.firstname
                dataa.lastname = data.lastname
                dataa.stageName = data.stageName
                dataa.address = data.address
                dataa.postcodeId = data.postcodeId
                dataa.stateId = data.stateId
                dataa.latitude = data.latitude
                dataa.longitude = data.longitude
                dataa.country = data.country
                dataa.dob = data.dob
                dataa.facebook = data.facebook
                dataa.instagram = data.instagram
                dataa.facebookEmail = data.facebookEmail
                dataa.instagramEmail = data.instagramEmail
                dataa.gender = data.gender
                dataa.hairColor = data.hairColor
                dataa.RSA = data.RSA
                dataa.profilePhoto.splice(0, 1, '/' + normalize(req.file.path))
                dataa.biography = data.biography
                dataa.bankName = data.bankName
                dataa.accountHolderName = data.accountHolderName
                dataa.BSB = data.BSB
                dataa.accountNumber = data.accountNumber
                dataa.yourSpeciality = data.yourSpeciality
                dataa.termConditionEmail = data.termConditionEmail
                dataa.termConditionAccept = data.termConditionAccept
                dataa.guidelines = data.guidelines
                dataa.paymentTermsTravelRates = data.paymentTermsTravelRates

                await dataa.save()
                return utils.sendSuccessResponse(res, { 'error': false, 'message': 'Updated successfully...' })
            } catch (err) {
                return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
            }
        })
    } catch (err) {
        return utils.sendErrorResponse(res, 400, { 'error': true, 'message': err.message })
    }
}