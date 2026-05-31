const Joi = require("joi");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../utils/validate");
const { sql, getPool } = require("../config/db");
const AppError = require("../utils/AppError");

const createReportSchema = Joi.object({
    reportedUserId: Joi.number().integer().required(),
    reason: Joi.string()
        .valid("Scam", "Fake Product", "Rude/Disrespectful", "Not Responding", "Other")
        .required(),
    description: Joi.string().max(1000).optional().allow(""),
    evidenceSummary: Joi.string().max(2000).optional().allow(""),
});

const createReport = asyncHandler(async (req, res) => {
    const { value, error } = createReportSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        return res.status(400).json({
            ok: false,
            message: "Validation failed",
            details: error.details.map((d) => ({
                path: d.path.join("."),
                msg: d.message,
            })),
        });
    }

    const { reportedUserId, reason, description, evidenceSummary } = value;

    // Check if trying to report self
    if (reportedUserId === req.user.id) {
        throw new AppError("You cannot report yourself", 400);
    }

    // Check if user exists
    const pool = await getPool();
    await pool.request().query(`
      IF COL_LENGTH('dbo.Reports', 'EvidenceSummary') IS NULL
        ALTER TABLE dbo.Reports ADD EvidenceSummary NVARCHAR(MAX) NULL;
    `);
    const userCheck = await pool
        .request()
        .input("UserID", sql.Int, reportedUserId)
        .query("SELECT UserID FROM dbo.Users WHERE UserID = @UserID");

    if (userCheck.recordset.length === 0) {
        throw new AppError("User not found", 404);
    }

    // Create report
    const reportRes = await pool
        .request()
        .input("ReporterID", sql.Int, req.user.id)
        .input("ReportedID", sql.Int, reportedUserId)
        .input("Reason", sql.NVarChar(100), reason)
        .input("Description", sql.NVarChar("MAX"), description || null)
        .input("EvidenceSummary", sql.NVarChar("MAX"), evidenceSummary || null)
        .query(`
      INSERT INTO dbo.Reports (ReporterID, ReportedID, Reason, Description, EvidenceSummary, Status, CreatedAt)
      OUTPUT inserted.*
      VALUES (@ReporterID, @ReportedID, @Reason, @Description, @EvidenceSummary, 'Pending', GETDATE());
    `);

    const report = reportRes.recordset[0];
    res.status(201).json({ ok: true, report });
});

module.exports = {
    createReport,
    createReportValidator: validate(createReportSchema),
};
