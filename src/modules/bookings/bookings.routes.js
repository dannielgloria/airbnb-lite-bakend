const router = require("express").Router();
const authMiddleware = require('../../middleware/auth.middleware');
const controller = require("./bookings.controller");

router.post("/", authMiddleware, controller.create);
router.get("/me", authMiddleware, controller.mine);
router.patch("/:id/cancel", authMiddleware, controller.cancel);
router.get("/host/all", authMiddleware, controller.host);

module.exports = router;
