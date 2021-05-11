const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = mongoose.Schema;

const agentSchema = new schema({
    fullname: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        unique: true,
        required: true
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address...'],
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    ABNNumber: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    BSB: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    licenseORpassport: {
        type: String,
        required: true
    },
    utilityBilORMedicardeORCreditCard: {
        type: String,
        required: true
    },
    tokens: [{
        type: String,
        default: null
    }],
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

// encrypt password before saving to database

agentSchema.pre('save', async function(next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    next();
});

// comparing password

agentSchema.methods.comparePassword = function(password, hash) {
    return bcrypt.compareSync(password, hash);
}

// encrypt password

agentSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

module.exports = mongoose.model('agency', agentSchema)