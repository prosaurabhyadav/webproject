const mongoose = require('mongoose');
const schema = mongoose.Schema;

const emailGroupSchema = new schema({
    userType: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    emailAddress: [{
        type: String,
        required: true
    }],
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('emailgroup', emailGroupSchema)