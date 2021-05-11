const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = mongoose.Schema;

const employmentSchema = new schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    stageName: {
        type: String,
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
    mobile: {
        type: Number,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    postcodeId: {
        type: schema.Types.ObjectId,
        ref: 'statepostcode',
        required: true
    },
    stateId: {
        type: schema.Types.ObjectId,
        ref: 'state',
        required: true
    },
    country: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        default: null,
        // required: true
    },
    longitude: {
        type: String,
        default: null,
        // required: true
    },
    facebook: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
        required: true
    },
    instagram: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No',
        required: true
    },
    facebookEmail: {
        type: String,
        default: null
    },
    instagramEmail: {
        type: String,
        default: null
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    RSA: {
        type: String,
        enum: ['Yes', 'No'],
        required: true
    },
    hairColor: {
        type: String,
        required: true
    },
    licenseORpassport: {
        type: String,
        default: null,
        // required: true
    },
    utilityBilORMedicardeORCreditCard: {
        type: String,
        default: null,
        // required: true
    },
    profilePhoto: [{
        type: String,
        default: null,
        required: true
    }],
    biography: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    accountHolderName: {
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
    yourSpeciality: {
        type: String,
        required: true
    },
    serviceCategory: [{
        type: schema.Types.ObjectId,
        ref: 'category',
        unique: true,
        default: null
    }],
    serviceSubCategory: [{
        type: schema.Types.ObjectId,
        ref: 'subcategory',
        unique: true,
        default: null
    }],
    termConditionEmail: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'Yes',
        required: true
    },
    termConditionAccept: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'Yes',
        required: true
    },
    guidelines: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'Yes',
        required: true
    },
    paymentTermsTravelRates: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'Yes',
        required: true
    },
    status: {
        type: String,
        default: '1' // 0 for offline and 1 for online
    },
    tokens: [{
        type: String,
        default: null,
    }],
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

// encrypt password before saving to database

employmentSchema.pre('save', async function(next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    next();
});

// comparing password

employmentSchema.methods.comparePassword = function(password, hash) {
    return bcrypt.compareSync(password, hash);
}

// encrypt password

employmentSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

module.exports = mongoose.model('employment', employmentSchema)