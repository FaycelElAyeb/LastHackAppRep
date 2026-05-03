const express = require('express');
const nodemailer = require('nodemailer');
const { createNotificationPreviews } = require('../services/alertService');

const router = express.Router();

router.post('/preview', (req, res) => {
  const students = req.body.students || [];
  const previews = createNotificationPreviews(students);
  res.json({ previews });
});

router.post('/send-email', async (req, res, next) => {
  try {
    const students = req.body.students || [];
    const previews = createNotificationPreviews(students);

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.MAIL_FROM || user;

    if (!host || !user || !pass || !from) {
      return res.json({
        message: 'SMTP is not configured. Email bodies were generated but not sent.',
        count: previews.length
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    for (const item of previews) {
      await transporter.sendMail({
        from,
        to: item.email,
        subject: item.subject,
        text: item.emailBody
      });
    }

    res.json({ message: 'Emails sent successfully.', count: previews.length });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
