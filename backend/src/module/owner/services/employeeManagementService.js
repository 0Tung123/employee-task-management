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
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const newEmployee = {
      id: employeeId,
      name: employeeData.name,
      email: employeeData.email,
      phone: employeeData.phone || '',
      role: 'Employee',
      department: employeeData.department || '',
      position: employeeData.position || '',
      password: hashedPassword,
      tempPassword: randomPassword,
      createdAt: new Date(),
      lastLogin: null,
      isActive: true,
      isVerified: false
    };
    const docRef = doc(employeesCollection, employeeId);
    await setDoc(docRef, newEmployee);
    await sendWelcomeEmail(newEmployee);
    delete newEmployee.tempPassword;
    delete newEmployee.password;
    return newEmployee;
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
    return { success: true, message: 'Employee deleted successfully' };
  } catch (error) {
    throw error;
  }
};

const setEmployeeSchedule = async (employeeId, scheduleData) => {
  try {
    await getEmployeeById(employeeId);
    const scheduleId = uuidv4();
    const schedule = {
      id: scheduleId,
      employeeId: employeeId,
      date: scheduleData.date,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      breakDuration: scheduleData.breakDuration || 0,
      notes: scheduleData.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const docRef = doc(schedulesCollection, scheduleId);
    await setDoc(docRef, schedule);
    return schedule;
  } catch (error) {
    throw error;
  }
};

const getEmployeeSchedules = async (employeeId, startDate, endDate) => {
  try {
    let q = query(schedulesCollection, where('employeeId', '==', employeeId));
    if (startDate) {
      q = query(q, where('date', '>=', startDate));
    }
    if (endDate) {
      q = query(q, where('date', '<=', endDate));
    }
    q = query(q, orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    const schedules = [];
    querySnapshot.forEach((doc) => {
      schedules.push({ id: doc.id, ...doc.data() });
    });
    return schedules;
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

const sendWelcomeEmail = async (employee) => {
  try {
    const subject = 'Welcome to Employee Task Management System';
    const message = `
      <h2>Welcome ${employee.name}!</h2>
      <p>Your account has been created in our Employee Task Management System.</p>
      
      <h3>Your Login Credentials:</h3>
      <p><strong>Email:</strong> ${employee.email}</p>
      <p><strong>Temporary Password:</strong> ${employee.tempPassword}</p>
      
      <p>To access your account:</p>
      <ol>
        <li>Use the LoginEmail API endpoint with your email</li>
        <li>You will receive an OTP via email</li>
        <li>Use the ValidateAccessCode API to complete login</li>
      </ol>
      
      <p><em>Note: Please change your password after first login for security.</em></p>
      
      <p>If you have any questions, please contact your manager.</p>
    `;
    await emailService.sendEmail(employee.email, subject, message);
  } catch (error) {
  }
};

module.exports = {
  getEmployeeById,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  setEmployeeSchedule,
  getEmployeeSchedules,
  findEmployeeByEmail
};