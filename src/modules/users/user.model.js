const mongose = require('mongoose');

const userSchema = new mongose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongose.model('User', userSchema);