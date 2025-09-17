const nodemailer = require('nodemailer');

const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
};

const createEmailTransporter = () => {
  return nodemailer.createTransporter(emailConfig);
};

module.exports = {
  emailConfig,
  createEmailTransporter
};