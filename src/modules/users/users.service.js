const User = require('./user.model');
const ApiError = require('../../utils/apiError');

const updateMe = async (userId, updateData) => {
    const allowedUpdates = ['name', 'email', 'password'];
    const updates = Object.keys(updateData);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
    if (!isValidOperation) throw new ApiError(400, 'Invalid updates');
    
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    updates.forEach((update) => {
        if (update === 'password') {
            user.passwordHash = updateData.password; // This should be hashed in a real implementation
        } else {
            user[update] = updateData[update];
        }
    });
    await user.save();
    
    return { id: user._id, name: user.name, email: user.email };
}

module.exports = {
    updateMe
};