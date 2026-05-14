const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const ctrl = require('../controllers/payment.controller');

const router = express.Router();

router.post('/initiate', requireAuth, ctrl.initiateValidator, ctrl.initiate);
// Public endpoint — verified by gateway signature.
router.post('/webhook', ctrl.webhookValidator, ctrl.webhook);

module.exports = router;
