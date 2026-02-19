const router = require('express').Router();
const authMiddleware = require('../../middleware/auth.middleware');
const controller = require('./listings.controller');

router.get('/', controller.list);
router.get('/:id', controller.getById);

router.post('/', authMiddleware, controller.create);
router.put('/:id', authMiddleware, controller.update);
router.delete('/:id', authMiddleware, controller.remove);

router.post(
    '/:id/photos',
    authMiddleware,
    controller.uploadMiddleware, // Permite subir hasta 5 fotos
    controller.uploadPhotos);

module.exports = router;