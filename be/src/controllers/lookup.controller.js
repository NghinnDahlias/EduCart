const asyncHandler = require('../utils/asyncHandler');
const { sql, getPool } = require('../config/db');

const getUniversities = asyncHandler(async (req, res) => {
  const pool = await getPool();
  const r = await pool
    .request()
    .query('SELECT UniversityID, UName, DomainEmail FROM dbo.Universities ORDER BY UName');
  res.json({ ok: true, universities: r.recordset });
});

const getFaculties = asyncHandler(async (req, res) => {
  const pool = await getPool();
  const r = await pool
    .request()
    .input('UniversityID', sql.Int, Number(req.params.universityId))
    .query(`
      SELECT FacultyID, FacultyName
      FROM dbo.Faculties
      WHERE UniversityID = @UniversityID
      ORDER BY FacultyName
    `);
  res.json({ ok: true, faculties: r.recordset });
});

const getSubjects = asyncHandler(async (req, res) => {
  const pool = await getPool();
  const r = await pool
    .request()
    .input('FacultyID', sql.Int, Number(req.params.facultyId))
    .query(`
      SELECT SubjectID, SubjectCode, SubjectName
      FROM dbo.Subjects
      WHERE FacultyID = @FacultyID
      ORDER BY SubjectName
    `);
  res.json({ ok: true, subjects: r.recordset });
});

module.exports = { getUniversities, getFaculties, getSubjects };
