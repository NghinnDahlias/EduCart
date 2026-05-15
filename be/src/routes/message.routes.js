const express = require('express');
const requireAuth = require('../middlewares/requireAuth');
const ctrl = require('../controllers/message.controller');

const router = express.Router();

router.get('/conversations', requireAuth, ctrl.getConversations);
router.get('/', requireAuth, ctrl.getMessages);
router.post('/', requireAuth, ctrl.sendValidator, ctrl.send);

module.exports = router;
