const mongoose = require('mongoose');
const schema = mongoose.Schema;

const promocodeSchema = new schema({
    promocode: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('promocode', promocodeSchema)