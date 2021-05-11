const mongoose = require('mongoose');
const schema = mongoose.Schema;

const subCategoryDetailSchema = new schema({
    categoryId: {
        type: schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    subCategoryId: {
        type: schema.Types.ObjectId,
        ref: 'subcategory',
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    servicePrice: {
        type: schema.Types.Decimal128,
        required: true
    },
    strippergramShare: {
        type: schema.Types.Decimal128,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('subcategorydetail', subCategoryDetailSchema)