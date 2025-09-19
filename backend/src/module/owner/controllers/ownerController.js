const ownerService = require('../services/ownerService');

const createOwner = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    
    if (!name || !phoneNumber) {
      return res.status(400).json({ error: 'Name and phone number are required' });
    }

    const owner = await ownerService.createOwner({ name, phoneNumber });
    res.status(201).json(owner);
  } catch (error) {
    console.error('Error creating owner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getOwnerProfile = async (req, res) => {
  try {
    const { phoneNumber } = req.user;
    const owner = await ownerService.getOwnerByPhone(phoneNumber);
    
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    res.json(owner);
  } catch (error) {
    console.error('Error getting owner profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createOwner,
  getOwnerProfile
};