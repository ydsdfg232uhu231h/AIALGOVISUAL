import nodemailer from "nodemailer";
<<<<<<< HEAD
import fs from "fs";
import path from "node:path";
=======
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
>>>>>>> 00085f140ffe65d31de9ed0868d0ac7bfd12e6f3


<<<<<<< HEAD

const templatePath = path.join(process.cwd(), "backend", "view", "notification.html");
=======
// 1. Verify environment variables on load
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.error(
    "[Nodemailer Config Error]: GMAIL_USER or GMAIL_APP_PASSWORD is missing in process.env."
  );
}
>>>>>>> 00085f140ffe65d31de9ed0868d0ac7bfd12e6f3

// 2. Initialize Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Non-blocking, clean verification
transporter.verify()
  .then(() => console.log("[Nodemailer]: Server is ready to send messages"))
  .catch((err) => console.error("[Nodemailer Verify Error]: Check Gmail App Password:", err.message));

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
    if (!userEmail) {
      throw new Error("userEmail is required to send a notification.");
    }

    // 3. Resolve path to HTML template
    const templatePath = path.resolve(__dirname, "../view/notification.html");

    if (!existsSync(templatePath)) {
      throw new Error(`Template file not found at: ${templatePath}`);
    }

    // 4. Async read prevents blocking the Node.js event loop
    let htmlContent = await fs.readFile(templatePath, "utf-8");

    // Replace placeholders
    htmlContent = htmlContent
      .replace(/{{userName}}/g, userName)
      .replace(/{{subject}}/g, subject)
      .replace(/{{text}}/g, text);

    // Resolve path to logo image
    const logoPath = path.resolve(process.cwd(), "images", "a1.png");

    const mailOptions = {
      from: `"${defaultSender.name}" <${defaultSender.email}>`,
      to: userName ? `"${userName}" <${userEmail}>` : userEmail,
      subject: subject,
      text: text,
      html: htmlContent,
      attachments: existsSync(logoPath)
        ? [
            {
              filename: "a1.png",
              path: logoPath,
              cid: "aafps_logo", // In your HTML, use: <img src="cid:aafps_logo" />
            },
          ]
        : [],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("[Nodemailer Success]: Message sent successfully!");
    console.log("[Message ID]:", info.messageId);
    console.log("[Accepted]:", info.accepted);
    console.log("[Rejected]:", info.rejected);

    return {
      success: true,
      message_ids: [info.messageId],
      response: info.response,
    };
  } catch (error) {
    console.error("[Nodemailer Error]: Failed to send email ->", error.message);
    if (error.code) console.error("[Nodemailer Error Code]:", error.code);
    if (error.response) console.error("[Nodemailer Response]:", error.response);
    throw error;
  }
}