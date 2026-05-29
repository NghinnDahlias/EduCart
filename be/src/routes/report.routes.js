const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const ctrl = require("../controllers/report.controller");

const router = express.Router();

router.post("/", requireAuth, ctrl.createReportValidator, ctrl.createReport);

module.exports = router;
