const emailService = require('../services/emailService');

const otpStorage = new Map();

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    otpStorage.set(email, {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });
    
    await emailService.sendOTPEmail(email, otp);
    res.json({ 
      success: true, 
      message: `OTP sent successfully to ${email}`,
      otp: otp // For development/testing only - remove in production
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to send OTP email',
      details: error.message 
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const storedData = otpStorage.get(email);
    
    if (!storedData) {
      return res.status(400).json({ error: 'No OTP found for this email' });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStorage.delete(email);
      return res.status(400).json({ error: 'OTP has expired' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    otpStorage.delete(email);
    
    res.json({ 
      success: true, 
      message: 'OTP verified successfully',
      user: {
        email: email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to verify OTP',
      details: error.message 
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};