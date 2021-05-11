const jwt = require('jsonwebtoken');
const agentSchema = require('../models/agency.model');
const employmentSchema = require('../models/employment.model');
const adminSchema = require('../models/admin.model');
const utils = require('../utils/responses');

// set data 

exports.setData = async(user) => {
    const userData = JSON.parse(JSON.stringify(user));
    delete userData.password;
    delete userData.tokens;
    delete userData.createdAt;
    delete userData.updatedAt;
    return userData
}

// set agency data

const setAgencyData = async(req, user, token) => {
    const userData = JSON.parse(JSON.stringify(user));
    delete userData.password;
    delete userData.tokens;
    delete userData.createdAt;
    delete userData.updatedAt;
    delete userData.__v;
    req.user = userData;
    req.token = token;
}

// generate access token for both agent and employee

exports.newGenerateAccessToken = async function(user) {
    if (user.type == 'agency') {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        const u = await agentSchema.updateOne({ '_id': user.userId }, { $push: { 'tokens': token } }, { new: true })
        return token;
    } else if (user.type == 'employment') {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        const u = await employmentSchema.updateOne({ '_id': user.userId }, { $push: { 'tokens': token } }, { new: true })
        return token;
    } else if (user.type == 'admin') {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        const u = await adminSchema.updateOne({ '_id': user.userId }, { 'tokens': token }, { new: true })
        return token;
    }
};

// verify token for both agent and employee

exports.newUserAuthentication = function(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return utils.sendErrorResponse(res, 403, { 'error': true, 'message': 'Unauthorized user...' }) // if there isn't any tokenres.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, user) => {
        console.log(err)
        if (err) return utils.sendErrorResponse(res, 401, { 'error': true, 'message': 'Unauthorized user...' }) // return res.status(403).send({ message: "session expires, please login..." })
        if (user.type == 'agency') {
            const userData = await agentSchema.findOne({ '_id': user.userId, 'tokens': token })
            if (!userData) {
                return utils.sendErrorResponse(res, 401, { 'error': true, 'message': 'Session expires, please login...' })
            }
            setAgencyData(req, userData, token)
            req.type = user.type
            next()
        } else if (user.type == 'employment') {
            const userData = await employmentSchema.findOne({ '_id': user.userId, 'tokens': token })
            if (!userData) {
                return utils.sendErrorResponse(res, 401, { 'error': true, 'message': 'Session expires, please login...' })
            }
            setAgencyData(req, userData, token)
            req.type = user.type
            next()
        } else if (user.type == 'admin') {
            const userData = await adminSchema.findOne({ '_id': user.userId, 'tokens': token })
            if (!userData) {
                return utils.sendErrorResponse(res, 401, { 'error': true, 'message': 'Session expires, please login...' })
            }
            setAgencyData(req, userData, token)
            req.type = user.type
            next()
        }
    })
}