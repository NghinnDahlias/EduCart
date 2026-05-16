const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const { uploadAvatar } = require("../middlewares/upload");
const ctrl = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", requireAuth, ctrl.getMe);
router.put("/me", requireAuth, ctrl.updateMe);

// Upload avatar — multipart/form-data, field name: "avatar"
router.post(
  "/me/avatar",
  requireAuth,
  uploadAvatar.single("avatar"),
  ctrl.uploadAvatar,
);

module.exports = router;
