const User = require('./user.model');
const ApiError = require('../../utils/apiError');
const bcrypt = require('bcrypt');

const updateMe = async (userId, updateData) => {

    if (!updateData || Object.keys(updateData).length === 0) {
        throw new ApiError(400, 'No data provided for update');
    }

    const allowedUpdates = ['name', 'email', 'password'];

    const updates = Object.keys(updateData);
    const isValidOperation = updates.every(field => allowedUpdates.includes(field));

    if (!isValidOperation) throw new ApiError(400, 'Invalid updates');

    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, 'User not found');

    // 🔥 updates explícitos (patrón seguro)
    
    if (updateData.name) user.name = updateData.name;

    if (updateData.email) {

        const normalizedEmail = updateData.email.toLowerCase();

        const exists = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: userId }
        });

        if (exists) throw new ApiError(409, 'Email already in use');

        user.email = normalizedEmail;
    }

    if (updateData.password) {

        if (updateData.password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

        const passwordHash = await bcrypt.hash(updateData.password, 10);
        user.passwordHash = passwordHash;
    }

    await user.save();

    return {
        id: user._id,
        name: user.name,
        email: user.email
    };
};

module.exports = {
    updateMe
};