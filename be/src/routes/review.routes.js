const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const ctrl = require("../controllers/review.controller");

// Mounted at /products/:productId/reviews (mergeParams: true)
const router = express.Router({ mergeParams: true });

router.get("/", ctrl.list);
router.post("/", requireAuth, ctrl.createValidator, ctrl.create);

module.exports = router;
