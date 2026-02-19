const router = require('express').Router();
const controller = require('./users.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.put('/me', authMiddleware, controller.updateMe); 

module.exports = router;