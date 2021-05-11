const profileDataSchema = require('../models/profiledata.model');
const categorySchema = require('../models/category.model');
const subCategoryDetailSchema = require('../models/subcategorydetail.model');
const eventSchema = require('../models/event.model');
const employmentSchema = require('../models/employment.model');
// profile data of male or female

const profileData = async(gender) => {
    return (await profileDataSchema.findOne({ gender: gender }, ['-createdAt', '-updatedAt']))
};

// category data of male or female

const categoryAndSubCategoryData = async(gender) => {
    const data = await categorySchema.aggregate([{
            $match: {
                gender: gender
            }
        }, {
            $lookup: {
                from: 'subcategories',
                localField: '_id',
                foreignField: 'categoryId',
                as: 'subcategory'
            }
        },
        {
            $project: {
                gender: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
                // 'subcategory.categoryId': 0,
                'subcategory.servicePricePerHour': 0,
                'subcategory.strippergramSharePerHour': 0,
                'subcategory.serviceDuration': 0,
                'subcategory.gender': 0,
                'subcategory.createdAt': 0,
                'subcategory.updatedAt': 0,
                'subcategory.__v': 0
            }
        }
    ])
    return (data)
};


// male profile data and its categories

exports.profileandCategoryandSubCategory = async(gender) => {
    let profileDetail = await profileData(gender)
    let categoryAndSubCategoryDetail = await categoryAndSubCategoryData(gender)

    if (!profileDetail && !categoryAndSubCategoryDetail.length) {
        return ({ 'error': true, 'message': 'Data not found...' })
    }
    if (!profileDetail) {
        profileDetail = 'Data not found...'
    }
    if (!categoryAndSubCategoryDetail.length) {
        categoryAndSubCategoryDetail = 'Data not found...'
    }
    return ({ 'error': false, 'profileData': profileDetail, 'categoryAndSubCategoryData': categoryAndSubCategoryDetail })
}

// sub-category detail

exports.subCategoryDetail = async(subcategoryid) => {
    const subCategoryData = await subCategoryDetailSchema.findOne({ subCategoryId: subcategoryid }).select(['-createdAt', '-updatedAt'])

    if (!subCategoryData) {
        return ({ 'error': true, 'subCategoryData': 'Data not found...', })
    }
    return ({ 'error': false, 'subCategoryData': subCategoryData })
}

// get all event

exports.event = async() => {
    return (await eventSchema.find().select(['-createdAt', '-updatedAt']))
}

// sub-category data

exports.subCategoryData = async(subcategoryId) => {
    const subCategoryDetail = await employmentSchema.find({ serviceSubCategory: subcategoryId }).select(['firstname', 'profilePhoto'])
    if (!subCategoryDetail.length) {
        return ({ 'error': true, 'message': 'Record not found...', })
    }
    return ({ 'error': false, 'subCategoryData': subCategoryDetail })
}

// all active employee on the basis of gender

exports.activeEmployee = async(gender) => {
    const activeEmployeeData = await employmentSchema.find({ gender: gender, status: '1' }).select(['firstname', 'profilePhoto'])
    if (!activeEmployeeData) {
        return ({ 'error': true, 'message': 'No active employees...', })
    }
    return ({ 'error': false, 'activeEmployeeData': activeEmployeeData })
}

// employee detail

exports.employeeDetail = async(employeeId) => {
    const employeeData = await employmentSchema.findOne({
            _id: employeeId
        }, ['firstname', 'lastname', 'stageName', 'biography', 'profilePhoto', 'serviceSubCategory', 'facebook', 'instagram', 'facebookEmail', 'instagramEmail'])
        .populate({ path: 'serviceSubCategory', select: ['-createdAt', '-updatedAt'] })
    if (!employeeData) {
        return ({ 'error': true, 'message': 'Not found...' })
    }
    return ({ 'error': true, 'employeeData': employeeData })
}

// all services

exports.allServices = async(gender) => {
    return (await categoryAndSubCategoryData(gender))
}

// employee by sub-category

exports.employeeBySubCategory = async(subCategoryId) => {
    const data = await employmentSchema.find({ 'serviceSubCategory': subCategoryId, 'status': '1' }).select(['firstname', 'profilePhoto'])
    if (!data.length) {
        return ({ 'error': true, 'message': 'Record not found...' })
    }
    return ({ 'error': false, 'data': data })
}

exports.da = categoryAndSubCategoryData