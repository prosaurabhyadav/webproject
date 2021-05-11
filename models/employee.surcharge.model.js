const mongoose = require('mongoose');
const schema = mongoose.Schema;

const employeeSurchargeSchema = new schema({
    employeeId: {
        type: schema.Types.ObjectId,
        ref: 'employment',
        required: true
    },
    serviceCategoryId: {
        type: schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    serviceSubCategoryId: {
        type: schema.Types.ObjectId,
        ref: 'subcategory',
        required: true
    },
    serviceSurcharge: {
        type: schema.Types.Decimal128,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('employeeSurcharge', employeeSurchargeSchema)