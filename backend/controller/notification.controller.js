import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_TOKEN;

// Initialize the Mailtrap client using your API token
const client = new MailtrapClient({ token: TOKEN });

// Default Sender (Use standard demo sender for sandbox/testing)
const defaultSender = {
  email: "aafps@demomailtrap.co", // Or your verified custom domain email
  name: "AAFPS",
};

/**
 * Reusable MVC Notification Function
 * @param {string} userEmail - Recipient's email address
 * @param {string} [userName] - Optional recipient name
 * @param {string} [subject] - Email subject
 * @param {string} [text] - Email text content
 */
export async function notifyUser({
  userEmail,
  userName = "User",
  subject = "You have registered to AAFPS",
  text = "We hope our website will solve your problem.",
}) {
  const recipients = [
    {
      email: userEmail,
      name: userName,
    },
  ];

  try {
    const response = await client.send({
      from: defaultSender,
      to: recipients,
      subject: subject,
      text: text,
      category: "User Registration",
    });

    console.log("[Mailtrap Success]:", response);
    return response;
  } catch (error) {
    console.error("[Mailtrap Error]:", error);
    throw error;
  }
}