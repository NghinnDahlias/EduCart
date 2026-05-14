const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const ctrl = require('../controllers/order.controller');

const router = express.Router();

router.post('/', requireAuth, ctrl.createValidator, ctrl.create);
router.post(
  '/:id/transitions',
  requireAuth,
  ctrl.transitionValidator,
  ctrl.transition,
);

module.exports = router;
