const { db } = require('../../../configs/firebase.config');
const { doc, setDoc, getDoc, deleteDoc, updateDoc, collection, query, where, getDocs, orderBy } = require('firebase/firestore');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const emailService = require('../../email/services/emailService');

const employeesCollection = collection(db, 'employees');
const schedulesCollection = collection(db, 'schedules');

const getEmployeeById = async (employeeId) => {
  try {
    const docRef = doc(employeesCollection, employeeId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('Employee not found');
    }
    const employeeData = { id: docSnap.id, ...docSnap.data() };
    delete employeeData.password;
    return employeeData;
  } catch (error) {
    throw error;
  }
};

const getAllEmployees = async () => {
  try {
    const q = query(employeesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const employees = [];
    querySnapshot.forEach((doc) => {
      const employeeData = { id: doc.id, ...doc.data() };
      delete employeeData.password;
      employees.push(employeeData);
    });
    return employees;
  } catch (error) {
    throw error;
  }
};

const createEmployee = async (employeeData) => {
  try {
    const existingEmployee = await findEmployeeByEmail(employeeData.email);
    if (existingEmployee) {
      throw new Error('Employee with this email already exists');
    }
    const employeeId = uuidv4();
    const verificationToken = uuidv4(); // Unique link token
    const newEmployee = {
      id: employeeId,
      name: employeeData.name,
      email: employeeData.email,
      phone: employeeData.phone || '',
      role: employeeData.role || 'Employee',
      department: employeeData.department || '',
      position: employeeData.position || '',
      status: 'pending', // Status pending
      verificationToken: verificationToken,
      tokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
      lastLogin: null,
      isActive: false,
      isVerified: false
    };
    const docRef = doc(employeesCollection, employeeId);
    await setDoc(docRef, newEmployee);
    await sendSetupAccountEmail(newEmployee);
    return { success: true, employeeId: employeeId };
  } catch (error) {
    throw error;
  }
};

const updateEmployee = async (employeeId, updateData) => {
  try {
    await getEmployeeById(employeeId);
    if (updateData.email) {
      const existingEmployee = await findEmployeeByEmail(updateData.email);
      if (existingEmployee && existingEmployee.id !== employeeId) {
        throw new Error('Another employee with this email already exists');
      }
    }
    const docRef = doc(employeesCollection, employeeId);
    const updatePayload = {
      ...updateData,
      updatedAt: new Date()
    };
    await updateDoc(docRef, updatePayload);
    const updatedEmployee = await getEmployeeById(employeeId);
    return updatedEmployee;
  } catch (error) {
    throw error;
  }
};

const deleteEmployee = async (employeeId) => {
  try {
    await getEmployeeById(employeeId);
    const docRef = doc(employeesCollection, employeeId);
    await deleteDoc(docRef);
    await deleteEmployeeSchedules(employeeId);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

const findEmployeeByEmail = async (email) => {
  try {
    const q = query(employeesCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

const sendSetupAccountEmail = async (employee) => {
  try {
    await emailService.sendWelcomeEmail(employee.email, employee.name, employee.verificationToken);
  } catch (error) {
    console.error('Failed to send setup account email:', error);
  }
};

const findEmployeeByToken = async (verificationToken) => {
  try {
    const q = query(employeesCollection, where('verificationToken', '==', verificationToken));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

const setupAccount = async (token, password, username) => {
  try {
    const employee = await findEmployeeByToken(token);
    if (!employee) {
      throw new Error('Invalid or expired token');
    }

    if (employee.tokenExpiresAt.toDate() < new Date()) {
      throw new Error('Token has expired');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const docRef = doc(employeesCollection, employee.id);
    await updateDoc(docRef, {
      password: hashedPassword,
      username: username,
      isVerified: true,
      isActive: true,
      status: 'active',
      verificationToken: null,
      tokenExpiresAt: null,
      updatedAt: new Date()
    });

    return { success: true, message: 'Account setup completed successfully' };
  } catch (error) {
    throw error;
  }
};

const deleteEmployeeSchedules = async (employeeId) => {
  try {
    const q = query(schedulesCollection, where('employeeId', '==', employeeId));
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getEmployeeById,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  findEmployeeByEmail,
  findEmployeeByToken,
  setupAccount
};