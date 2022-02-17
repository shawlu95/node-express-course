const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors');

const auth = async (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Please log in');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId).select('-password');
        console.log("User is authenticated", user);
        req.user = {userId: payload.userId, name: payload.name};
        next();
    } catch (error) {
        throw new UnauthenticatedError('Invalid credential');
    }
};

module.exports = auth;

