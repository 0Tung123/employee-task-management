const { db } = require('../../../configs/firebase.config');
const { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, deleteDoc } = require('firebase/firestore');
const { v4: uuidv4 } = require('uuid');

const tasksCollection = collection(db, 'tasks');

const createTask = async (taskData) => {
  try {
    const taskId = uuidv4();
    const newTask = {
      id: taskId,
      title: taskData.title,
      description: taskData.description || '',
      assigneeId: taskData.assigneeId,
      assigneeName: taskData.assigneeName,
      assigneeEmail: taskData.assigneeEmail,
      ownerId: taskData.ownerId,
      ownerName: taskData.ownerName,
      priority: taskData.priority || 'medium',
      status: 'todo',
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
      notes: taskData.notes || ''
    };

    const docRef = doc(tasksCollection, taskId);
    await setDoc(docRef, newTask);
    
    return newTask;
  } catch (error) {
    throw error;
  }
};

const getAllTasks = async (filters = {}) => {
  try {
    const querySnapshot = await getDocs(tasksCollection);
    const allTasks = [];
    
    querySnapshot.forEach((doc) => {
      const taskData = { id: doc.id, ...doc.data() };
      
      if (taskData.createdAt) {
        taskData.createdAt = taskData.createdAt.toDate().toISOString();
      }
      if (taskData.updatedAt) {
        taskData.updatedAt = taskData.updatedAt.toDate().toISOString();
      }
      if (taskData.completedAt) {
        taskData.completedAt = taskData.completedAt.toDate().toISOString();
      }
      if (taskData.dueDate) {
        taskData.dueDate = taskData.dueDate.toDate().toISOString();
      }
      
      allTasks.push(taskData);
    });
    
    let filteredTasks = allTasks;
    
    if (filters.assigneeId) {
      filteredTasks = filteredTasks.filter(task => task.assigneeId === filters.assigneeId);
    }
    
    if (filters.ownerId) {
      filteredTasks = filteredTasks.filter(task => task.ownerId === filters.ownerId);
    }
    
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }
    
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return filteredTasks;
  } catch (error) {
    throw error;
  }
};

const getTaskById = async (taskId) => {
  try {
    const docRef = doc(tasksCollection, taskId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Task not found');
    }
    
    const taskData = { id: docSnap.id, ...docSnap.data() };
    
    if (taskData.createdAt) {
      taskData.createdAt = taskData.createdAt.toDate().toISOString();
    }
    if (taskData.updatedAt) {
      taskData.updatedAt = taskData.updatedAt.toDate().toISOString();
    }
    if (taskData.completedAt) {
      taskData.completedAt = taskData.completedAt.toDate().toISOString();
    }
    if (taskData.dueDate) {
      taskData.dueDate = taskData.dueDate.toDate().toISOString();
    }
    
    return taskData;
  } catch (error) {
    throw error;
  }
};

const updateTask = async (taskId, updateData) => {
  try {
    const existingTask = await getTaskById(taskId);
    
    const docRef = doc(tasksCollection, taskId);
    const updatePayload = {
      ...updateData,
      updatedAt: new Date()
    };
    
    if (updateData.status === 'done' && existingTask.status !== 'done') {
      updatePayload.completedAt = new Date();
    }
    
    if (updateData.status && updateData.status !== 'done' && existingTask.status === 'done') {
      updatePayload.completedAt = null;
    }
    
    await updateDoc(docRef, updatePayload);
    
    const updatedTask = await getTaskById(taskId);
    return updatedTask;
  } catch (error) {
    throw error;
  }
};

const deleteTask = async (taskId) => {
  try {
    await getTaskById(taskId);
    
    const docRef = doc(tasksCollection, taskId);
    await deleteDoc(docRef);
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

const getTaskStats = async (filters = {}) => {
  try {
    const tasks = await getAllTasks(filters);
    
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length,
      overdue: 0
    };
    
    const now = new Date();
    stats.overdue = tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < now && 
      t.status !== 'done' && 
      t.status !== 'cancelled'
    ).length;
    
    return stats;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
};