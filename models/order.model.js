const mongoose = require('mongoose');
const schema = mongoose.Schema;
const pointSchema = require('../models/point.model');

const orderSchema = new schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    },
    employeeId: {
        type: schema.Types.ObjectId,
        ref: 'employment',
        required: true
    },
    userId: {
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
    servicePrice: {
        type: schema.Types.Decimal128,
        required: true
    },
    adminShare: {
        type: schema.Types.Decimal128,
        required: true
    },
    travellingAllowance: {
        type: schema.Types.Decimal128,
        required: true
    },
    serviceDuration: {
        type: String,
        required: true
    },
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        required: true
    },
    serviceAddress: {
        type: String,
        required: true
    },
    location: {
        type: pointSchema,
        index: '2dsphere',
        // required: true
    },
    orderStatus: {
        type: String,
        enum: ['0', '1', '2', '3', '4', '6'], //   0=new order, 1=accept, 2=cancel, ongoing=3, completed=4, expired=6
        default: '0',
        // required: true
    },
    emailStatus: {
        type: String,
        enum: ['0', '1'],
        default: '0',
        // required: true
    },
    promocode: {
        type: String,
        // default: null
    },
    eventId: {
        type: schema.Types.ObjectId,
        ref: 'event',
        required: true
    },
    eventPrice: {
        type: schema.Types.Decimal128,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

// orderSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('order', orderSchema)