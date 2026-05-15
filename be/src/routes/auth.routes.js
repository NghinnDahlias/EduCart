const express = require('express');
const ctrl = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', ctrl.registerValidator, ctrl.register);
router.post('/login', ctrl.loginValidator, ctrl.login);

module.exports = router;
