const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};



const sendOTPEmail = async (email, otp) => {
  const subject = 'Your OTP Code - Employee Login';
  const text = `Your OTP code for login is: ${otp}\n\nThis code will expire in 5 minutes.\n\nRegards,\nEmployee Management Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Employee Login OTP</h2>
      <p>Your OTP code for login is:</p>
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <br>
      <p>Regards,<br>Employee Management Team</p>
    </div>
  `;

  await sendEmail(email, subject, text, html);
};



module.exports = {
  sendEmail,
  sendOTPEmail
};