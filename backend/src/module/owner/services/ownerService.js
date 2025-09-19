const { db } = require('../../../configs/firebase.config');
const { collection, doc, setDoc, getDoc } = require('firebase/firestore');
const { generateToken } = require('../../../configs/jwt.config');

const ownersCollection = collection(db, 'owners');

const createOwner = async (ownerData) => {
  try {
    const { name, phoneNumber, role = 'owner' } = ownerData;
    
    const owner = {
      name,
      phoneNumber,
      role,
      createdAt: new Date(),
      isActive: true
    };

    const docRef = doc(ownersCollection, phoneNumber);
    await setDoc(docRef, owner);

    return { id: phoneNumber, ...owner };
  } catch (error) {
    console.error('Error creating owner:', error);
    throw error;
  }
};

const getOwnerByPhone = async (phoneNumber) => {
  try {
    const docRef = doc(ownersCollection, phoneNumber);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting owner by phone:', error);
    throw error;
  }
};

const generateOwnerToken = async (phoneNumber) => {
  try {
    const owner = await getOwnerByPhone(phoneNumber);
    
    if (!owner) {
      throw new Error('Owner not found');
    }

    const tokenPayload = {
      id: owner.id,
      phoneNumber: owner.phoneNumber,
      name: owner.name,
      role: owner.role
    };

    const token = generateToken(tokenPayload);

    return {
      owner: {
        id: owner.id,
        name: owner.name,
        phoneNumber: owner.phoneNumber,
        role: owner.role
      },
      token
    };
  } catch (error) {
    console.error('Error generating owner token:', error);
    throw error;
  }
};

module.exports = {
  createOwner,
  getOwnerByPhone,
  generateOwnerToken
};