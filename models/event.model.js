const mongoose = require('mongoose');
const schema = mongoose.Schema;

const eventSchema = new schema({
    eventName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('event', eventSchema)