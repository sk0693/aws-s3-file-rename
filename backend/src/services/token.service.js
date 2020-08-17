const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/config');

const generateToken = (userId, secret = config.jwt.secret) => {
    const payload = {
        sub: userId
    };
    return jwt.sign(payload, secret);
};


const verifyToken = async (token) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const userDoc = await User.findOne({ token, user: payload.sub });
    if (!userDoc) {
        throw 'Token not found';
    }
    return userDoc;
};

module.exports = {
    generateToken,
    verifyToken,
};