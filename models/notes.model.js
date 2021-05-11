const mongoose = require('mongoose');
const schema = mongoose.Schema;

const notesSchema = new schema({
    userId: {
        type: schema.Types.ObjectId,
        required: true
    },
    userType: {
        type: String,
        enum: ['agency', 'employment'],
        required: true
    },
    userNotes: {
        type: String,
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('notes', notesSchema)