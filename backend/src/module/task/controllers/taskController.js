const taskService = require('../services/taskService');
const employeeService = require('../../owner/services/employeeManagementService');

const createTask = async (req, res) => {
  try {
    const { title, description, assigneeId, priority, dueDate, notes } = req.body;
    const { id: ownerId, role } = req.user;
    
    if (role.toLowerCase() !== 'owner') {
      return res.status(403).json({
        success: false,
        error: 'Only owners can create tasks'
      });
    }
    
    if (!title || !assigneeId) {
      return res.status(400).json({
        success: false,
        error: 'Title and assignee are required'
      });
    }
    
    const assignee = await employeeService.getEmployeeById(assigneeId);
    if (!assignee) {
      return res.status(404).json({
        success: false,
        error: 'Assignee not found'
      });
    }
    
    const ownerData = req.user;
    
    const taskData = {
      title,
      description,
      assigneeId,
      assigneeName: assignee.name,
      assigneeEmail: assignee.email,
      ownerId,
      ownerName: ownerData.name || 'Owner',
      priority,
      dueDate,
      notes
    };
    
    const newTask = await taskService.createTask(taskData);
    
    const io = req.app.get('io');
    if (io) {
      io.to(`employee_${assigneeId}`).emit('task_created', {
        task: newTask,
        message: `New task assigned: ${newTask.title}`
      });
      
      io.to(`owner_${ownerId}`).emit('task_created', {
        task: newTask,
        message: `Task created successfully: ${newTask.title}`
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create task',
      details: error.message
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const { assigneeId, status, ownerId } = req.query;
    const { id, role } = req.user;
    
    let filters = {};
    
    if (role.toLowerCase() === 'employee') {
      filters.assigneeId = id;
    } else if (role.toLowerCase() === 'owner') {
      if (assigneeId) filters.assigneeId = assigneeId;
      if (ownerId) filters.ownerId = ownerId;
      else filters.ownerId = id;
    }
    
    if (status) filters.status = status;
    
    const tasks = await taskService.getAllTasks(filters);
    
    res.json({
      success: true,
      tasks,
      count: tasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get tasks',
      details: error.message
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user;
    
    const task = await taskService.getTaskById(id);
    
    if (role.toLowerCase() === 'employee' && task.assigneeId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only view your own tasks'
      });
    }
    
    if (role.toLowerCase() === 'owner' && task.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only view tasks you created'
      });
    }
    
    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message === 'Task not found' ? error.message : 'Failed to get task'
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;
    const { id: userId, role } = req.user;
    
    const existingTask = await taskService.getTaskById(id);
    
    const canUpdate = 
      (role.toLowerCase() === 'employee' && existingTask.assigneeId === userId) ||
      (role.toLowerCase() === 'owner' && existingTask.ownerId === userId);
      
    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to update this task'
      });
    }
    
    if (role.toLowerCase() === 'employee') {
      const allowedFields = ['status', 'notes'];
      const filteredUpdateData = {};
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredUpdateData[field] = updateData[field];
        }
      });
      updateData = filteredUpdateData;
    }
    
    const updatedTask = await taskService.updateTask(id, updateData);
    
    const io = req.app.get('io');
    if (io) {
      io.to(`owner_${existingTask.ownerId}`).emit('task_updated', {
        task: updatedTask,
        updatedBy: role,
        message: `Task updated: ${updatedTask.title}`
      });
      
      if (role.toLowerCase() === 'owner') {
        io.to(`employee_${existingTask.assigneeId}`).emit('task_updated', {
          task: updatedTask,
          updatedBy: role,
          message: `Task updated: ${updatedTask.title}`
        });
      }
    }
    
    res.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message === 'Task not found' ? error.message : 'Failed to update task'
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user;
    
    const existingTask = await taskService.getTaskById(id);
    
    if (role.toLowerCase() !== 'owner') {
      return res.status(403).json({
        success: false,
        error: 'Only owners can delete tasks'
      });
    }
    
    if (existingTask.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete tasks you created'
      });
    }
    
    await taskService.deleteTask(id);
    
    const io = req.app.get('io');
    if (io) {
      io.to(`employee_${existingTask.assigneeId}`).emit('task_deleted', {
        taskId: id,
        message: `Task deleted: ${existingTask.title}`
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message === 'Task not found' ? error.message : 'Failed to delete task'
    });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const { assigneeId, ownerId } = req.query;
    const { id, role } = req.user;
    
    let filters = {};
    
    if (role.toLowerCase() === 'employee') {
      filters.assigneeId = id;
    } else if (role.toLowerCase() === 'owner') {
      if (assigneeId) filters.assigneeId = assigneeId;
      if (ownerId) filters.ownerId = ownerId;
      else filters.ownerId = id;
    }
    
    const stats = await taskService.getTaskStats(filters);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get task statistics'
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
};