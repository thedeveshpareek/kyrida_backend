import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: 'thedeveshpareek@gmail.com',
        pass: 'pmnf ncnl mtky jpwr'
      },
    });

    await transporter.sendMail({
      from: `"Event App" <thedeveshpareek@gmail.com>`,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw new Error("Email sending failed");
  }
};
