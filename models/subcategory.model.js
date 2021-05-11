const mongoose = require('mongoose');
const schema = mongoose.Schema;

const subCategorySchema = new schema({
    categoryId: {
        type: schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    subCategoryName: {
        type: String,
        required: true
    },
    servicePricePerHour: {
        type: schema.Types.Decimal128,
        required: true
    },
    strippergramSharePerHour: {
        type: schema.Types.Decimal128,
        required: true
    },
    serviceDuration: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('subcategory', subCategorySchema)