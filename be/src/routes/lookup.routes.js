const express = require('express');
const ctrl = require('../controllers/lookup.controller');

const router = express.Router();

router.get('/universities', ctrl.getUniversities);
router.get('/universities/:universityId/faculties', ctrl.getFaculties);
router.get('/faculties/:facultyId/subjects', ctrl.getSubjects);

module.exports = router;
