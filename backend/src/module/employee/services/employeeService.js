const { db } = require('../../../configs/firebase.config');
const { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } = require('firebase/firestore');
const { sendEmployeeCredentials } = require('../../email/services/emailService');
const crypto = require('crypto');

const employeesCollection = collection(db, 'employees');

const generatePassword = () => {
  return crypto.randomBytes(8).toString('hex');
};

const createEmployee = async (employeeData) => {
  try {
    const password = generatePassword();
    const employee = {
      ...employeeData,
      password,
      createdAt: new Date(),
      schedules: [],
    };

    const docRef = doc(employeesCollection);
    await setDoc(docRef, employee);

    // Send email
    await sendEmployeeCredentials(employee.email, employee.name, password);

    return { id: docRef.id, ...employee };
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

const getAllEmployees = async () => {
  try {
    const querySnapshot = await getDocs(employeesCollection);
    const employees = [];
    querySnapshot.forEach((doc) => {
      employees.push({ id: doc.id, ...doc.data() });
    });
    return employees;
  } catch (error) {
    console.error('Error getting employees:', error);
    throw error;
  }
};

const getEmployeeById = async (id) => {
  try {
    const docRef = doc(employeesCollection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Employee not found');
    }
  } catch (error) {
    console.error('Error getting employee:', error);
    throw error;
  }
};

const updateEmployee = async (id, updateData) => {
  try {
    const docRef = doc(employeesCollection, id);
    await updateDoc(docRef, updateData);
    return { id, ...updateData };
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

const deleteEmployee = async (id) => {
  try {
    const docRef = doc(employeesCollection, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

const addSchedule = async (id, schedule) => {
  try {
    const employee = await getEmployeeById(id);
    const schedules = employee.schedules || [];
    schedules.push(schedule);
    await updateEmployee(id, { schedules });
  } catch (error) {
    console.error('Error adding schedule:', error);
    throw error;
  }
};

const updateSchedule = async (id, scheduleIndex, schedule) => {
  try {
    const employee = await getEmployeeById(id);
    const schedules = employee.schedules || [];
    if (scheduleIndex >= schedules.length) {
      throw new Error('Schedule index out of range');
    }
    schedules[scheduleIndex] = schedule;
    await updateEmployee(id, { schedules });
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};

const deleteSchedule = async (id, scheduleIndex) => {
  try {
    const employee = await getEmployeeById(id);
    const schedules = employee.schedules || [];
    if (scheduleIndex >= schedules.length) {
      throw new Error('Schedule index out of range');
    }
    schedules.splice(scheduleIndex, 1);
    await updateEmployee(id, { schedules });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  addSchedule,
  updateSchedule,
  deleteSchedule,
};