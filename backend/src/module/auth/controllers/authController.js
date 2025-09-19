const authService = require('../services/authService');
const { generateToken } = require('../../../configs/jwt.config');

const CreateNewAccessCode = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await authService.saveOTPToFirebase(phone, otp, 'owner');
    await authService.sendSMSOTP(phone, otp);
    
    res.json({ 
      success: true, 
      message: `OTP sent successfully to ${phone}`,
      otp: otp // For development/testing only - remove in production
    });
  } catch (error) {
    console.error('Error sending SMS OTP:', error);
    res.status(500).json({ 
      error: 'Failed to send SMS OTP',
      details: error.message 
    });
  }
};

const LoginEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await authService.saveOTPToFirebase(email, otp, 'employee');
    await authService.sendEmailOTP(email, otp);
    
    res.json({ 
      success: true, 
      message: `OTP sent successfully to ${email}`,
      otp: otp // For development/testing only - remove in production
    });
  } catch (error) {
    console.error('Error sending Email OTP:', error);
    res.status(500).json({ 
      error: 'Failed to send Email OTP',
      details: error.message 
    });
  }
};

const ValidateAccessCode = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ error: 'Identifier and OTP are required' });
    }
    const otpData = await authService.verifyOTPFromFirebase(identifier, otp);
    if (!otpData.valid) {
      return res.status(400).json({ error: otpData.message });
    }
    const userRecord = await authService.authenticateUser(identifier, otpData.userType);
    const tokenPayload = {
      userId: userRecord.id,
      identifier: identifier,
      userType: otpData.userType,
      role: userRecord.role,
      loginTime: Date.now()
    };
    const jwtToken = generateToken(tokenPayload);
    await authService.clearOTPFromFirebase(identifier);
    res.json({ 
      success: true, 
      message: 'OTP verified successfully',
      token: jwtToken,
      user: {
        id: userRecord.id,
        name: userRecord.name,
        identifier: identifier,
        userType: otpData.userType,
        role: userRecord.role,
        createdAt: userRecord.createdAt,
        lastLogin: userRecord.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

module.exports = {
  CreateNewAccessCode,
  LoginEmail,
  ValidateAccessCode
};