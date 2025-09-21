const authService = require('../services/authService');
const { generateToken } = require('../../../configs/jwt.config');
const bcrypt = require('bcryptjs');
const employeeService = require('../../owner/services/employeeManagementService');

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
    });
  } catch (error) {
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
    });
  } catch (error) {
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

const EmployeeLogin = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Username/Email and password are required' 
      });
    }

    const employee = await employeeService.findEmployeeByUsernameOrEmail(usernameOrEmail.trim());
    
    if (employee) {
    }
    
    if (!employee) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid username/email or password' 
      });
    }

    if (!employee.isVerified || !employee.password) {
      return res.status(401).json({ 
        success: false,
        error: 'Account not setup yet. Please check your email for setup instructions.' 
      });
    }

    if (!employee.isActive || employee.status !== 'active') {
      return res.status(401).json({ 
        success: false,
        error: 'Account is not active. Please contact your administrator.' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid username/email or password' 
      });
    }

    const tokenPayload = {
      userId: employee.id,
      email: employee.email,
      username: employee.username,
      userType: 'employee',
      role: employee.role,
      loginTime: Date.now()
    };
    const jwtToken = generateToken(tokenPayload);

    await employeeService.updateEmployee(employee.id, {
      lastLogin: new Date()
    });

    res.json({ 
      success: true, 
      message: 'Login successful',
      token: jwtToken,
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        username: employee.username,
        role: employee.role,
        department: employee.department,
        position: employee.position,
        status: employee.status,
        createdAt: employee.createdAt,
        lastLogin: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Login failed. Please try again.' 
    });
  }
};

module.exports = {
  CreateNewAccessCode,
  LoginEmail,
  ValidateAccessCode,
  EmployeeLogin
};
