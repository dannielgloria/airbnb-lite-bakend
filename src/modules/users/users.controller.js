const userService = require('./users.service');

const updateMe = async (req, res) => {
    const data = await userService.updateMe(req.user.sub, req.body);
    res.json(data);
}

module.exports = {
    updateMe
}