import nodemailer from "nodemailer";
import fs from "fs";
import path, { dirname } from "path";
// 1. Initialize Nodemailer transporter with Gmail SMTP
const templatePath = path.join(__dirname ,"view",  "notification.html");
let htmlContent = fs.readFileSync(templatePath, "utf-8");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Default Sender
const defaultSender = {
  email: process.env.GMAIL_USER,
  name: "AAFPS",
};

/**
 * Reusable MVC Notification Function with Rich HTML Template
 * @param {string} userEmail - Recipient's email address
 * @param {string} [userName] - Optional recipient name
 * @param {string} [subject] - Email subject
 * @param {string} [text] - Plain text fallback
 */
export async function notifyUser({
  userEmail,
  userName = "User",
  subject = "Welcome to AAFPS - We're thrilled to have you!",
  text = "Welcome to AAFPS! We are excited to have you on board.",
}) {
  // Rich HTML Email Template
 

  const mailOptions = {
    from: `"${defaultSender.name}" <${defaultSender.email}>`,
    to: userName ? `"${userName}" <${userEmail}>` : userEmail,
    subject: subject,
    text: text,
    html: htmlContent || undefined,
    // CID Attachment embeds the local file into the email so Gmail renders it without needing external hosting
    attachments: [
      {
        filename: "a1.png",
        path: process.cwd() + "/images/a1.png", // Or adjust relative path: './images/a1.png'
        cid: "aafps_logo", // Matches src="cid:aafps_logo" in the HTML template
      },
    ],
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