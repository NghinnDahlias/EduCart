const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const upload = require('../middlewares/upload');
const ctrl = require('../controllers/product.controller');

const router = express.Router();

router.get('/', ctrl.list);
// Up to 5 images per product (matches Multer limit + service check).
router.post('/', requireAuth, upload.array('images', 5), ctrl.create);
router.get('/:id', ctrl.getById);

module.exports = router;
