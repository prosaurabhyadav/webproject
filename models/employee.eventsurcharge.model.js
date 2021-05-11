const mongoose = require('mongoose');
const schema = mongoose.Schema;

const employeeEventSurchargeSchema = new schema({
    employeeId: {
        type: schema.Types.ObjectId,
        ref: 'employment',
        required: true
    },
    eventId: {
        type: schema.Types.ObjectId,
        ref: 'event',
        required: true
    },
    eventSurcharge: {
        type: schema.Types.Decimal128,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('employeeEventSurcharge', employeeEventSurchargeSchema)