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
    // Return only success and employeeId as requested
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

const sendSetupAccountEmail = async (employee) => {
  try {
    const subject = 'Welcome to Employee Task Management System - Setup Your Account';
    const setupLink = `${process.env.FRONTEND_URL}/setup-account?token=${employee.verificationToken}`;
    const message = `
      <h2>Welcome ${employee.name}!</h2>
      <p>Your account has been created in our Employee Task Management System.</p>
      
      <p>To complete your account setup and start using the system, please click the link below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${setupLink}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Setup My Account
        </a>
      </div>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 3px;">
        ${setupLink}
      </p>
      
      <p><strong>Important:</strong> This link will expire in 7 days for security reasons.</p>
      
      <p>If you have any questions, please contact your manager.</p>
    `;
    await emailService.sendEmail(employee.email, subject, message);
  } catch (error) {
    console.error('Failed to send setup account email:', error);
  }
};

const findEmployeeByToken = async (verificationToken) => {
  try {
    const q = query(employeesCollection, where('verificationToken', '==', verificationToken));
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

const verifyEmployeeToken = async (verificationToken) => {
  try {
    const employee = await findEmployeeByToken(verificationToken);
    if (!employee) {
      throw new Error('Invalid verification token');
    }
    
    // Check if token is expired
    if (new Date() > employee.tokenExpiresAt.toDate()) {
      throw new Error('Verification token has expired');
    }
    
    // Check if already verified
    if (employee.status !== 'pending') {
      throw new Error('Account has already been setup');
    }
    
    return employee;
  } catch (error) {
    throw error;
  }
};

const setupEmployeeAccount = async (verificationToken, setupData) => {
  try {
    const employee = await verifyEmployeeToken(verificationToken);
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(setupData.password, 10);
    
    // Update employee status and remove verification token
    const docRef = doc(employeesCollection, employee.id);
    const updatePayload = {
      password: hashedPassword,
      status: 'active',
      isActive: true,
      isVerified: true,
      verificationToken: null,
      tokenExpiresAt: null,
      setupCompletedAt: new Date(),
      updatedAt: new Date()
    };
    
    // Update additional info if provided
    if (setupData.phone) updatePayload.phone = setupData.phone.trim();
    if (setupData.name) updatePayload.name = setupData.name.trim();
    
    await updateDoc(docRef, updatePayload);
    
    // Return employee data without sensitive info
    const updatedEmployee = await getEmployeeById(employee.id);
    return updatedEmployee;
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
  setEmployeeSchedule,
  getEmployeeSchedules,
  findEmployeeByEmail,
  findEmployeeByToken,
  verifyEmployeeToken,
  setupEmployeeAccount
};