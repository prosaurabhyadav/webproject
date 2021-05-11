const mongoose = require('mongoose');
const schema = mongoose.Schema;

const categorySchema = new schema({
    categoryName: {
        type: String,
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

module.exports = mongoose.model('category', categorySchema)