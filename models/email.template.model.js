const mongoose = require('mongoose');
const schema = mongoose.Schema;

const emailTemplateSchema = new schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    // subjectAdmin: {
    //     type: String
    // },
    // bodyAdmin: {
    //     type: String
    // },
    templateType: {
        type: String,
        default: '2', // 1 for template and 2 for normal email
        required: true
    },
    status: {
        type: String,
        default: '1',
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('emailtemplate', emailTemplateSchema)