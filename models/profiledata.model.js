const mongoose = require('mongoose');
const schema = mongoose.Schema;

const profileDataSchema = new schema({
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    profilePhoto: {
        type: String,
        required: true
    },
    profileDescription: {
        type: String,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('profiledata', profileDataSchema)