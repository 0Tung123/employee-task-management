const nodemailer = require('nodemailer');
const templateLoader = require('../../../templates/email/templateLoader');

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
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};



const sendOTPEmail = async (email, otp) => {
  const subject = 'Your Verification Code - Employee Management System';
  const text = `Your OTP code for login is: ${otp}\n\nThis code will expire in 10 minutes.\n\nRegards,\nEmployee Management Team`;
  
  const html = templateLoader.getOTPTemplate(otp);

  await sendEmail(email, subject, text, html);
};



const sendWelcomeEmail = async (email, name, setupToken) => {
  const subject = 'Welcome to Employee Management - Setup Your Account';
  const setupUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/setup-account?token=${setupToken}`;
  const text = `Welcome ${name}!\n\nYou have been added to the Employee Management system. Please click the link below to setup your account:\n\n${setupUrl}\n\nThis link will expire in 24 hours.\n\nRegards,\nEmployee Management Team`;
  
  const html = templateLoader.getWelcomeTemplate({
    name: name,
    email: email,
    setupUrl: setupUrl
  });

  await sendEmail(email, subject, text, html);
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail
};