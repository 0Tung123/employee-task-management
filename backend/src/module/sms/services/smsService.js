const { db } = require('../../../configs/firebase.config');
const { doc, setDoc, getDoc, updateDoc } = require('firebase/firestore');
const { createVonageClient } = require('../../../configs/vonage.config');

const saveAccessCode = async (phoneNumber, accessCode) => {
  try {
    const docRef = doc(db, 'smsAccessCodes', phoneNumber);
    await setDoc(docRef, {
      phoneNumber,
      accessCode,
      createdAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving access code:', error);
    throw error;
  }
};

const validateAccessCode = async (phoneNumber, accessCode) => {
  try {
    const docRef = doc(db, 'smsAccessCodes', phoneNumber);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return false;
    }

    const data = docSnap.data();
    return data.accessCode === accessCode;
  } catch (error) {
    console.error('Error validating access code:', error);
    throw error;
  }
};

const clearAccessCode = async (phoneNumber) => {
  try {
    const docRef = doc(db, 'smsAccessCodes', phoneNumber);
    await updateDoc(docRef, {
      accessCode: '',
      validatedAt: new Date()
    });
  } catch (error) {
    console.error('Error clearing access code:', error);
    throw error;
  }
};

const sendSMS = async (phoneNumber, accessCode) => {
  try {
    const vonage = createVonageClient();
    const from = "Vonage APIs";
    const to = phoneNumber;
    const text = `Your access code is: ${accessCode}`;

    await vonage.sms.send({to, from, text})
      .then(resp => {
      })
      .catch(err => {
        console.error(err);
        throw err;
      });
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

module.exports = {
  saveAccessCode,
  validateAccessCode,
  clearAccessCode,
  sendSMS
};