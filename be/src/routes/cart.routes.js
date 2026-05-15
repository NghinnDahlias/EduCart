const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const ctrl = require('../controllers/cart.controller');

const router = express.Router();

router.get('/', requireAuth, ctrl.getCart);
router.post('/', requireAuth, ctrl.addValidator, ctrl.addToCart);
router.delete('/:productId', requireAuth, ctrl.removeFromCart);

module.exports = router;
