import nodemailer from "nodemailer";

export async function sendEmails({ to, subject, html }) {
  // transporter

  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // sender  gmail email
      pass: process.env.PASS, // password
    },
  });

  // receiver

  const info = await transporter.sendMail({
    from: `"Saraha App" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });

  console.log({ info });

  if (info.accepted.length > 0) return true;
  return false;
}
