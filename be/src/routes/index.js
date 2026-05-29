const express = require('express');
const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const paymentRoutes = require('./payment.routes');
const cartRoutes = require('./cart.routes');
const userRoutes = require('./user.routes');
const lookupRoutes = require('./lookup.routes');
const messageRoutes = require('./message.routes');
const reportRoutes = require('./report.routes');

const router = express.Router();

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/cart', cartRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);
router.use('/messages', messageRoutes);
router.use(lookupRoutes); // mounts at /universities and /faculties

module.exports = router;
