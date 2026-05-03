const express = require('express');
const multer = require('multer');
const path = require('path');
const { parseExcelFile } = require('../services/excelService');
const { analyzeStudents, buildDashboardPayload } = require('../services/analyticsService');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Excel file is required.' });
    }
    const rows = parseExcelFile(req.file.path);
    const students = await analyzeStudents(rows);
    const payload = buildDashboardPayload(students);
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
