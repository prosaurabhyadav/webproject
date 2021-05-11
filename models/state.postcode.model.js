const mongoose = require('mongoose');
const schema = mongoose.Schema;

const statePostcodeSchema = new schema({
    stateId: {
        type: schema.Types.ObjectId,
        ref: 'state',
        required: true
    },
    postcode: {
        type: Number,
        required: true
    },
    postcodeLatitude: {
        type: String,
        required: true
    },
    postcodeLongitude: {
        type: String,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('statepostcode', statePostcodeSchema)