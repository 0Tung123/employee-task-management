const smsService = require('../services/smsService');

const createNewAccessCode = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

    await smsService.saveAccessCode(phoneNumber, accessCode);

    try {
      await smsService.sendSMS(phoneNumber, accessCode);
      console.log(`SMS sent successfully to ${phoneNumber}`);
      res.json({ 
        accessCode,
        message: "SMS sent successfully" 
      });
    } catch (smsError) {
      console.error('Failed to send SMS:', smsError);
      res.status(500).json({ 
        error: 'Failed to send SMS', 
        details: smsError.message,
        accessCode
      });
    }
  } catch (error) {
    console.error('Error creating access code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const validateAccessCode = async (req, res) => {
  try {
    const { accessCode, phoneNumber } = req.body;

    if (!accessCode || !phoneNumber) {
      return res.status(400).json({ error: 'Access code and phone number are required' });
    }

    const isValid = await smsService.validateAccessCode(phoneNumber, accessCode);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid access code' });
    }

    await smsService.clearAccessCode(phoneNumber);

    res.json({ success: true });
  } catch (error) {
    console.error('Error validating access code:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createNewAccessCode,
  validateAccessCode
};