import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Safe directory resolution in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const templatePath = path.join(process.cwd(), "view", "notification.html");
const logoPath = path.join(process.cwd(), "images", "a1.png");

let rawHtmlTemplate = "";
try {
  if (fs.existsSync(templatePath)) {
    rawHtmlTemplate = fs.readFileSync(templatePath, "utf-8");
  }
} catch (err) {
  console.warn("[Nodemailer Warning]: Could not pre-load HTML template:", err.message);
}

// Gmail SMTP Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // 16-character Google App Password
  },
});

// Default Sender Identity
const defaultSender = {
  email: process.env.GMAIL_USER,
  name: "AAFPS",
};

/**
 * Reusable MVC Notification Function with Dynamic HTML & Inline CID Support
 * @param {Object} options
 * @param {string} options.userEmail - Recipient's email address
 * @param {string} [options.userName="User"] - Recipient's display name
 * @param {string} [options.subject] - Subject line
 * @param {string} [options.text] - Plaintext fallback body
 * @param {string} [options.customHtml] - Optional custom HTML override
 */
export async function notifyUser({
  userEmail,
  userName = "User",
  subject = "Welcome to AAFPS - We're thrilled to have you!",
  text = "Welcome to AAFPS! We are excited to have you on board.",
  customHtml = null,
}) {
  if (!userEmail) {
    throw new Error("[Nodemailer Error]: 'userEmail' is required.");
  }

  
  let finalHtml = customHtml;

  if (!finalHtml && rawHtmlTemplate) {
    finalHtml = rawHtmlTemplate
      .replace(/{{userName}}/g, userName)
      .replace(/{{subject}}/g, subject)
      .replace(/{{messageText}}/g, text.replace(/\n/g, "<br/>"))
      .replace(/{{year}}/g, new Date().getFullYear().toString());
  }

  const attachments = [];
  if (fs.existsSync(logoPath)) {
    attachments.push({
      filename: "a1.png",
      path: logoPath,
      cid: "aafps_logo",
    });
  }

  const mailOptions = {
    from: `"${defaultSender.name}" <${defaultSender.email}>`,
    to: userName ? `"${userName}" <${userEmail}>` : userEmail,
    subject: subject,
    text: text,
    html: finalHtml || undefined,
    attachments: attachments.length > 0 ? attachments : undefined,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    const response = {
      success: true,
      message_ids: [info.messageId],
      response: info.response,
    };

    console.log("[Nodemailer Success]:", response);
    return response;
  } catch (error) {
    console.error("[Nodemailer Error]:", error);
    throw error;
  }
}