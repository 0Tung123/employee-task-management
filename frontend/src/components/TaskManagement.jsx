import React, { useState, useEffect } from 'react';
import socket from '../API/socket';

import { createTask, getTasks, updateTask, deleteTask, getTaskStats } from '../API/tasks';
import { getAllEmployees } from '../API/owner';
import { getUserData } from '../API/auth';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigneeId: '',
    priority: 'medium',
    dueDate: ''
  });
  const [stats, setStats] = useState(null);
  
  const userData = getUserData();
  const isOwner = userData?.role === 'Owner';

  useEffect(() => {
    if (!userData) return;
    if (!isOwner) {
      socket.on('task_created', (data) => {
        loadTasks();
        loadTaskStats();
      });
    }
    if (isOwner) {
      socket.on('task_updated', (data) => {
        alert(`Task updated: ${data.message}`);
        loadTasks();
        loadTaskStats();
      });
    }
    return () => {
      socket.off('task_created');
      socket.off('task_updated');
    };
  }, [isOwner, userData]);

  useEffect(() => {
    loadTasks();
    loadTaskStats();
    if (isOwner) {
      loadEmployees();
    }
  }, [isOwner]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      if (response.success) {
        setTasks(response.tasks);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await getAllEmployees();
      if (response.success) {
        setEmployees(response.employees);
      }
    } catch (error) {
    }
  };

  const loadTaskStats = async () => {
    try {
      const response = await getTaskStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assigneeId) return;

    try {
      const response = await createTask(newTask);
      if (response.success) {
        setNewTask({
          title: '',
          description: '',
          assigneeId: '',
          priority: 'medium',
          dueDate: ''
        });
        setShowCreateForm(false);
        loadTasks();
        loadTaskStats();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      loadTasks();
      loadTaskStats();
    } catch (error) {
      console.error('Failed to update task status:', error);
      alert('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(taskId);
      loadTasks();
      loadTaskStats();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#fbbf24';
      case 'in-progress': return '#3b82f6';
      case 'done': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return <div className="loading-state"><p>Loading tasks...</p></div>;
  }

  return (
    <div className="task-management">
      <div className="content-header">
        <h2>Task Management</h2>
        {isOwner && (
          <button 
            className="create-btn" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create Task'}
          </button>
        )}
      </div>

      {/* Task Statistics */}
      {stats && (
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats.total}</h3>
              <p>Total Tasks</p>
            </div>
            <div className="stat-card">
              <h3>{stats.todo}</h3>
              <p>To Do</p>
            </div>
            <div className="stat-card">
              <h3>{stats.done}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Form */}
      {isOwner && showCreateForm && (
        <div className="create-task-form">
          <h3>Create New Task</h3>
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Assign To *</label>
              <select
                value={newTask.assigneeId}
                onChange={(e) => setNewTask({...newTask, assigneeId: e.target.value})}
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="datetime-local"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="create-btn">Create Task</button>
              <button 
                type="button" 
                onClick={() => setShowCreateForm(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-item">
              <div className="task-header">
                <h3>{task.title}</h3>
                <div className="task-badges">
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {task.status}
                  </span>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
              
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              
              <div className="task-meta">
                <div>Assignee: {task.assigneeName}</div>
                <div>Created: {new Date(task.createdAt).toLocaleDateString()}</div>
                {task.dueDate && (
                  <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                )}
              </div>

              {task.notes && (
                <div className="task-notes">
                  <strong>Notes:</strong> {task.notes}
                </div>
              )}

              <div className="task-actions">
                {!isOwner && (
                  <div className="employee-actions">
                    {task.status !== 'done' ? (
                      <button 
                        className="done-btn"
                        onClick={() => handleStatusChange(task.id, 'done')}
                      >
                        Mark as Done
                      </button>
                    ) : (
                      <span className="done-label">Completed</span>
                    )}
                  </div>
                )}
                
                {isOwner && (
                  <div className="owner-actions">
                    <div className="status-control">
                      <label>Status:</label>
                      <select 
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="status-dropdown"
                      >
                        <option value="todo">To Do</option>
                        <option value="done">Completed</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManagement;