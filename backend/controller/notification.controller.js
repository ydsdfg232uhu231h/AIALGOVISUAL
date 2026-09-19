import nodemailer from "nodemailer";

// 1. Initialize Nodemailer transporter with Gmail SMTP
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
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333333;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
      <tr>
        <td align="center" style="padding: 40px 15px;">
          
          <!-- Card Container -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e8ecf1;">
            
            <!-- Header with Embedded Logo -->
            <tr>
              <td align="center" style="padding: 35px 20px 20px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
                <img src="cid:aafps_logo" alt="AAFPS Logo" width="110" style="display: block; border: 0; outline: none; text-decoration: none; margin-bottom: 12px;" />
                <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Welcome to AAFPS!</h1>
              </td>
            </tr>

            <!-- Main Content Area -->
            <tr>
              <td style="padding: 35px 30px;">
                <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px; color: #1e293b;">
                  Hello <strong>${userName}</strong>,
                </p>
                <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px; color: #475569;">
                  We are delighted to have you with us! Thank you for joining the <strong>AAFPS</strong> family. Our platform is dedicated to streamlining your daily workflow and delivering dependable tools tailored specifically to solve your problems.
                </p>

                <h3 style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 28px 0 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
                  What you can do with AAFPS:
                </h3>

                <!-- Feature 1 -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;">
                  <tr>
                    <td width="28" valign="top" style="font-size: 16px; line-height: 1;">⚡</td>
                    <td style="font-size: 14px; line-height: 1.5; color: #334155;">
                      <strong>Fast &amp; Intuitive Management:</strong> Access organized dashboards and tools designed to save you hours of work.
                    </td>
                  </tr>
                </table>

                <!-- Feature 2 -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 14px;">
                  <tr>
                    <td width="28" valign="top" style="font-size: 16px; line-height: 1;">🔒</td>
                    <td style="font-size: 14px; line-height: 1.5; color: #334155;">
                      <strong>Secure &amp; Reliable:</strong> Industry-standard protection keeping your operations safe and compliant around the clock.
                    </td>
                  </tr>
                </table>

                <!-- Feature 3 -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 28px;">
                  <tr>
                    <td width="28" valign="top" style="font-size: 16px; line-height: 1;">📊</td>
                    <td style="font-size: 14px; line-height: 1.5; color: #334155;">
                      <strong>Real-Time Analytics &amp; Support:</strong> Instant insights and direct assistance whenever you need an answer.
                    </td>
                  </tr>
                </table>

                <!-- CTA Button -->
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding: 10px 0 20px;">
                      <a href="https://yourwebsite.com/dashboard" target="_blank" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block;">
                        Go to Your Dashboard
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 14px; line-height: 1.5; margin: 15px 0 0; color: #64748b; text-align: center;">
                  Need help getting started? Simply reply directly to this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #edf2f7;">
                <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
                  &copy; ${new Date().getFullYear()} AAFPS Inc. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

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