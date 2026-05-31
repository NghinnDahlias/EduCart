const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const requireAdmin = require("../middlewares/requireAdmin");
const ctrl = require("../controllers/admin.controller");

const router = express.Router();

router.get("/dashboard", requireAuth, requireAdmin, ctrl.getDashboard);
router.get("/users", requireAuth, requireAdmin, ctrl.listUsers);
router.post("/users/:id/action", requireAuth, requireAdmin, ctrl.actOnUser);
router.get("/reports", requireAuth, requireAdmin, ctrl.listReports);
router.post("/reports/:id/review", requireAuth, requireAdmin, ctrl.reviewReport);
router.get("/forum/posts", requireAuth, requireAdmin, ctrl.listForumPosts);
router.put("/forum/posts/:id", requireAuth, requireAdmin, ctrl.moderateForumPost);

module.exports = router;
