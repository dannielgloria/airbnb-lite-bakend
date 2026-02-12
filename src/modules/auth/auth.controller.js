const authService = require('./auth.service');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    res.status(201).json(user);
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const { accessToken } = await authService.login(email, password);
    res.json({ accessToken });
}

const me = async (req, res) => {
    const data = await authService.me(req.user.sub);
    res.json(data);
}

module.exports = {
    register,
    login,
    me
}