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

const sendEmployeeCredentials = async (email, name, password) => {
  const subject = 'Your Employee Account Credentials';
  const text = `Hello ${name},\n\nYour account has been created. Here are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after first login.\n\nRegards,\nEmployee Management Team`;
  const html = `<p>Hello ${name},</p><p>Your account has been created. Here are your login credentials:</p><p><strong>Email:</strong> ${email}<br><strong>Password:</strong> ${password}</p><p>Please change your password after first login.</p><p>Regards,<br>Employee Management Team</p>`;

  await sendEmail(email, subject, text, html);
};

module.exports = {
  sendEmail,
  sendEmployeeCredentials,
};