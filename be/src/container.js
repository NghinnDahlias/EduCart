/**
 * Tiny manual DI container. We wire all repositories and services
 * here once at boot — no service-locator magic, no decorators.
 */
const userRepository = require("./repositories/user.repository");
const productRepository = require("./repositories/product.repository");
const orderRepository = require("./repositories/order.repository");
const paymentRepository = require("./repositories/payment.repository");
const cartRepository = require("./repositories/cart.repository");
const messageRepository = require("./repositories/message.repository");
const reviewRepository = require("./repositories/review.repository");

const AuthService = require("./services/auth.service");
const ProductService = require("./services/product.service");
const OrderService = require("./services/order.service");
const PaymentService = require("./services/payment.service");
const ReviewService = require("./services/review.service");

const authService = new AuthService({ userRepository });
const productService = new ProductService({ productRepository });
const orderService = new OrderService({ orderRepository, productRepository });
const paymentService = new PaymentService({
  paymentRepository,
  orderRepository,
});
const reviewService = new ReviewService({ reviewRepository, orderRepository });

module.exports = {
  repositories: {
    userRepository,
    productRepository,
    orderRepository,
    paymentRepository,
    cartRepository,
    messageRepository,
    reviewRepository,
  },
  services: {
    authService,
    productService,
    orderService,
    paymentService,
    reviewService,
  },
};
