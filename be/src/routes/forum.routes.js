const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const { repositories } = require("../container");

// Import controller functions
const forumController = require("../controllers/forum.controller");

const router = express.Router();

// Public endpoints
router.get("/", forumController.list);
router.get("/:id", forumController.getById);

// Protected endpoints (require authentication)
router.post("/", requireAuth, forumController.create);
router.post("/:id/comments", requireAuth, forumController.addComment);
router.post("/:id/vote", requireAuth, forumController.vote);
router.delete("/:id", requireAuth, forumController.deletePost);

module.exports = router;
