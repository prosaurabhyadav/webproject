const mongoose = require('mongoose');
const schema = mongoose.Schema;

const descriptionSchema = new schema({
    type: {
        type: String,
        enum: ['Male_description', 'Female_description', 'Male_tc', 'Female_tc', 'Home_A', 'Home_B', 'User_Signup', 'Emp_Signup', 'Agency_Signup', 'Emp_tc', 'Emp_payment_rates', 'Emp_guidelines'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    specialCharacter: {
        type: String,
        default: null
    },
    specialCharacterStatus: {
        type: String,
        enum: ['0', '1'],
        default: '0',
        required: true
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

module.exports = mongoose.model('description', descriptionSchema)