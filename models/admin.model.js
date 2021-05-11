const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = mongoose.Schema;

const adminSchema = new schema({
    username: {
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
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    tokens: {
        type: String,
        default: null
    },
    __v: {
        type: Number,
        select: false
    }
}, { timestamps: true });

// encrypt password before saving to database

adminSchema.pre('save', async function(next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    next();
});

// comparing password

adminSchema.methods.comparePassword = function(password, hash) {
    return bcrypt.compareSync(password, hash);
}

// encrypt password

adminSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

module.exports = mongoose.model('admin', adminSchema)