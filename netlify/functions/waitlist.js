// netlify/functions/waitlist.js
const nodemailer = require("nodemailer");

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  try {
    const { email } = JSON.parse(event.body || "{}");

    if (!email || typeof email !== "string") {
      return json(400, { ok: false, error: "Email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return json(400, { ok: false, error: "Invalid email" });
    }

    // ✅ Ensure env vars exist
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return json(500, {
        ok: false,
        error:
          "Missing env vars: GMAIL_USER and/or GMAIL_APP_PASSWORD (set in Netlify).",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const to = process.env.WAITLIST_TO || process.env.GMAIL_USER;

    await transporter.sendMail({
      from: `Pictura Waitlist <${process.env.GMAIL_USER}>`,
      to,
      replyTo: cleanEmail, // ✅ lets you reply back to the person easily
      subject: "New Waitlist Signup",
      text: `New waitlist signup: ${cleanEmail}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="margin: 0 0 12px;">New Waitlist Signup</h2>
          <p style="margin: 0 0 6px;"><b>Email:</b> ${cleanEmail}</p>
          <p style="margin: 0; color: #666;">Sent from the Prelaunch waitlist form.</p>
        </div>
      `,
    });

    return json(200, { ok: true });
  } catch (err) {
    // Return a helpful error without exposing secrets
    return json(500, {
      ok: false,
      error: "Email failed to send. Check Netlify function logs + env vars.",
    });
  }
};