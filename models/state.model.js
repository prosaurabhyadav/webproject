const mongoose = require('mongoose');
const schema = mongoose.Schema;

const stateSchema = new schema({
    stateName: {
        type: String,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('state', stateSchema)