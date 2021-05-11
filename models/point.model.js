const mongoose = require('mongoose');
const schema = mongoose.Schema;

const pointSchema = new schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = pointSchema