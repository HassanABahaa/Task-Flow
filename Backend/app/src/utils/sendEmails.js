import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function sendEmails({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Task-Flow App" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });

  if (info.accepted.length > 0) return true;
  return false;
}

// helper جديد للـ email template
export function getActivationEmailHtml(activationLink, userName) {
  let html = readFileSync(
    join(__dirname, "../views/email-template.html"),
    "utf-8",
  );
  return html
    .replace(/{{ACTIVATION_LINK}}/g, activationLink)
    .replace(/{{USER_NAME}}/g, userName || "there");
}
