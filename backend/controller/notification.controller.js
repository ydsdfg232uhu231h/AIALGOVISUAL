import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Initialize the Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const defaultSender = {
  email: process.env.GMAIL_USER,
  name: "AAFPS",
};

/**
 * Reusable MVC Notification Function
 */
export async function notifyUser({
  userEmail,
  userName = "User",
  subject = "Welcome to AAFPS - We're thrilled to have you!",
  text = "Welcome to AAFPS! We are excited to have you on board.",
}) {
  try {
    // 1. Resolve path and load HTML inside the function safely
    const templatePath = path.join(process.cwd(), "backend", "view", "notification.html");
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    // 2. Replace placeholders in your HTML template (adjust keys to match your HTML, e.g. {{userName}})
    htmlContent = htmlContent
      .replace(/{{userName}}/g, userName)
      .replace(/{{subject}}/g, subject)
      .replace(/{{text}}/g, text);

    // 3. Resolve attachment path cross-platform
    const logoPath = path.join(process.cwd(), "images", "a1.png");

    const mailOptions = {
      from: `"${defaultSender.name}" <${defaultSender.email}>`,
      to: userName ? `"${userName}" <${userEmail}>` : userEmail,
      subject: subject,
      text: text,
      html: htmlContent,
      attachments: [
        {
          filename: "a1.png",
          path: logoPath,
          cid: "aafps_logo", // Must match <img src="cid:aafps_logo" /> in your HTML
        },
      ],
    };

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