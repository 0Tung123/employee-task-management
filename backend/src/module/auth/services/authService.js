const { db } = require('../../../configs/firebase.config');
const { doc, setDoc, getDoc, deleteDoc, updateDoc, collection, query, where, getDocs } = require('firebase/firestore');
const { createVonageClient } = require('../../../configs/vonage.config');
const emailService = require('../../email/services/emailService');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Collections
const ownersCollection = collection(db, 'owners');
const employeesCollection = collection(db, 'employees');

// Save OTP to Firebase Firestore
const saveOTPToFirebase = async (identifier, otp, userType) => {
  try {
    const otpDoc = doc(db, 'otps', identifier);
    await setDoc(otpDoc, {
      otp: otp,
      userType: userType, // 'owner' or 'employee'
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      createdAt: new Date()
    });
    console.log(`OTP saved to Firebase for ${userType}: ${identifier}`);
  } catch (error) {
    console.error('Error saving OTP to Firebase:', error);
    throw error;
  }
};

const sendSMSOTP = async (phone, otp) => {
  try {
    const vonage = createVonageClient();
    const message = {
      to: phone,
      from: process.env.VONAGE_BRAND_NAME || 'TaskManager',
      text: `Your access code is: ${otp}. This code will expire in 5 minutes. Do not share this code with anyone.`
    };
    const response = await vonage.sms.send(message);
    if (response.messages[0].status === '0') {
      return { success: true, messageId: response.messages[0]['message-id'] };
    } else {
      throw new Error(`SMS failed: ${response.messages[0]['error-text']}`);
    }
  } catch (error) {
    throw error;
  }
};

// Send Email OTP (reuse existing email service)
const sendEmailOTP = async (email, otp) => {
  try {
    await emailService.sendOTPEmail(email, otp);
    console.log(`Email OTP sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending Email OTP:', error);
    throw error;
  }
};

const verifyOTPFromFirebase = async (identifier, otp) => {
  try {
    const otpDoc = doc(db, 'otps', identifier);
    const docSnapshot = await getDoc(otpDoc);
    if (!docSnapshot.exists()) {
      return { valid: false, message: 'No OTP found for this identifier' };
    }
    const otpData = docSnapshot.data();
    if (new Date() > otpData.expiresAt.toDate()) {
      await deleteDoc(otpDoc);
      return { valid: false, message: 'OTP has expired' };
    }
    if (otpData.otp !== otp) {
      return { valid: false, message: 'Invalid OTP' };
    }
    return { 
      valid: true, 
      message: 'OTP is valid',
      userType: otpData.userType
    };
  } catch (error) {
    throw error;
  }
};

const clearOTPFromFirebase = async (identifier) => {
  try {
    const otpDoc = doc(db, 'otps', identifier);
    await deleteDoc(otpDoc);
  } catch (error) {
    throw error;
  }
};

const authenticateUser = async (identifier, userType) => {
  try {
    let existingUser = null;
    if (userType === 'owner') {
      existingUser = await findOwnerByPhone(identifier);
    } else if (userType === 'employee') {
      existingUser = await findEmployeeByEmail(identifier);
      // Check if employee account is setup
      if (existingUser && existingUser.status === 'pending') {
        throw new Error('Account setup is required. Please check your email for setup instructions.');
      }
      if (existingUser && !existingUser.isActive) {
        throw new Error('Account is inactive. Please contact your manager.');
      }
    }
    if (existingUser) {
      await updateUserLogin(existingUser.id, userType);
      return existingUser;
    }
    const newUser = await createNewUser(identifier, userType);
    return newUser;
  } catch (error) {
    throw error;
  }
};

const createNewUser = async (identifier, userType) => {
  try {
    const userId = uuidv4();
    const randomPassword = Math.random().toString(36).slice(-12);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const baseUserData = {
      id: userId,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true
    };
    let userData, userRecord;
    if (userType === 'owner') {
      userData = {
        ...baseUserData,
        name: 'Owner',
        phone: identifier,
        role: 'Owner'
      };
      userRecord = await createOwner(userData);
    } else if (userType === 'employee') {
      userData = {
        ...baseUserData,
        name: 'Employee',
        email: identifier,
        phone: '',
        role: 'Employee'
      };
      userRecord = await createEmployee(userData);
    }
    return userRecord;
  } catch (error) {
    throw error;
  }
};

const updateUserLogin = async (userId, userType) => {
  try {
    const updateData = { lastLogin: new Date() };
    if (userType === 'owner') {
      await updateOwner(userId, updateData);
    } else if (userType === 'employee') {
      await updateEmployee(userId, updateData);
    }
  } catch (error) {
    throw error;
  }
};

const createOwner = async (ownerData) => {
  try {
    const docRef = doc(ownersCollection, ownerData.id);
    await setDoc(docRef, ownerData);
    return { id: ownerData.id, ...ownerData };
  } catch (error) {
    throw error;
  }
};

const findOwnerByPhone = async (phone) => {
  try {
    const q = query(ownersCollection, where('phone', '==', phone));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw error;
  }
};

const updateOwner = async (ownerId, updateData) => {
  try {
    const docRef = doc(ownersCollection, ownerId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return { id: ownerId, ...updateData };
  } catch (error) {
    throw error;
  }
};

const createEmployee = async (employeeData) => {
  try {
    const docRef = doc(employeesCollection, employeeData.id);
    await setDoc(docRef, employeeData);
    return { id: employeeData.id, ...employeeData };
  } catch (error) {
    throw error;
  }
};

const findEmployeeByEmail = async (email) => {
  try {
    const q = query(employeesCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw error;
  }
};

const updateEmployee = async (employeeId, updateData) => {
  try {
    const docRef = doc(employeesCollection, employeeId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return { id: employeeId, ...updateData };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveOTPToFirebase,
  sendSMSOTP,
  sendEmailOTP,
  verifyOTPFromFirebase,
  clearOTPFromFirebase,
  authenticateUser,
  createOwner,
  findOwnerByPhone,
  updateOwner,
  createEmployee,
  findEmployeeByEmail,
  updateEmployee
};