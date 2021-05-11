const mongoose = require('mongoose');
const schema = mongoose.Schema;

const privateBookingSchema = new schema({
    employeeId: {
        type: schema.Types.ObjectId,
        ref: 'employment',
        required: true
    },
    startDateAndTime: {
        type: Date,
        required: true
    },
    stopDateAndTime: {
        type: Date,
        required: true
    },
    // startTime: {
    //     type: String,
    //     required: true
    // },
    // stopTime: {
    //     type: String,
    //     required: true
    // },
    scheduleNote: {
        type: String,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('privatebooking', privateBookingSchema)