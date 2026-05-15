const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const ctrl = require('../controllers/user.controller');

const router = express.Router();

router.get('/me', requireAuth, ctrl.getMe);
router.put('/me', requireAuth, ctrl.updateMe);

module.exports = router;
