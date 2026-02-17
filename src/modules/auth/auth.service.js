const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const { ApiError } = require('../../utils/apiError');

const register = async (name, email, password) => {
    if (!name || !email || !password) throw new ApiError(400, 'Name, email and password are required');
    
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) throw new ApiError(409, 'Email already in use');
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email: email.toLowerCase(), passwordHash });
    await user.save();

    return { id: user._id, name: user.name, email: user.email };
};

const login = async (email, password) => {
    if (!email || !password) throw new ApiError(400, 'Email and password are required');
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new ApiError(401, 'Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new ApiError(401, 'Invalid credentials');

    const token = jwt.sign(
        { sub: String(user._id), email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    return { accessToken: token };
}

const me = async (userId) => {
    const user = await User.findById(userId).select('_id name email createdAt');
    if (!user) throw new ApiError(404, 'User not found');
    return user;
}

module.exports = {
    register,
    login,
    me
};