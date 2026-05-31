const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const { uploadAvatar } = require("../middlewares/upload");
const ctrl = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", requireAuth, ctrl.getMe);
router.get("/me/profile-hub", requireAuth, ctrl.getProfileHub);
router.put("/me", requireAuth, ctrl.updateMe);
router.post("/me/change-password", requireAuth, ctrl.changePassword);
router.post("/me/check-in", requireAuth, ctrl.checkIn);

router.post(
  "/me/avatar",
  requireAuth,
  uploadAvatar.single("avatar"),
  ctrl.uploadAvatar,
);

router.get("/:id", ctrl.getUserPublic);

module.exports = router;
