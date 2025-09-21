require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const { db } = require('./configs/firebase.config');
const { collection, query, where, orderBy, getDocs } = require('firebase/firestore');
const { verifyToken } = require('./configs/jwt.config');

const authRoutes = require('./module/auth/routes/authRoutes');
const setupRoutes = require('./module/auth/routes/setupRoutes');
const ownerEmployeeRoutes = require('./module/owner/routes/employeeRoutes');
const employeeProfileRoutes = require('./module/employee/routes/profileRoutes');
const smsRoutes = require('./module/sms/routes/smsRoutes');
const emailRoutes = require('./module/email/routes/emailRoutes');
const taskRoutes = require('./module/task/routes/taskRoutes');
const messageRoutes = require('./module/messages/routes/messageRoutes');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.set('io', io);

app.use(cors({
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Employee Task Management API',
    version: '2.0',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/owner', ownerEmployeeRoutes);
app.use('/api/employee', employeeProfileRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);

io.use(async (socket, next) => {
  try {
    
    const token = socket.handshake.auth.token;
    
    
    if (!token) {
      
      return next(new Error('Authentication error'));
    }
    
    const decoded = verifyToken(token);
    
    
    socket.userId = decoded.userId;
    socket.userType = decoded.userType;
    socket.role = decoded.role;
    
    
    
    next();
  } catch (err) {
    
    next(new Error('Authentication error'));
  }
});


io.on('connection', async (socket) => {
  
  
  
  const userRoom = `user:${socket.userId}`;
  socket.join(userRoom);
  
  
  
  
  socket.on('join_task_room', (taskId) => {
    socket.join(`task_${taskId}`);
  });
  
  socket.on('leave_task_room', (taskId) => {
    socket.leave(`task_${taskId}`);
  });
  
  socket.on('typing_task_note', (data) => {
    socket.to(`task_${data.taskId}`).emit('user_typing_note', {
      userId: socket.userId,
      userType: socket.userType,
      isTyping: data.isTyping
    });
  });

  socket.on('private_message', async (data) => {
    try {
      
      const { toId, text } = data;
      
      if (!toId || !text || text.trim() === '') {
        socket.emit('message_error', { error: 'Missing required fields' });
        return;
      }

      const messageService = require('./module/messages/services/messageService');
      
      const toType = socket.userType === 'owner' ? 'employee' : 'owner';
      
      const messageData = {
        fromId: socket.userId,
        fromType: socket.userType,
        toId,
        toType,
        text: text.trim()
      };

      const message = await messageService.createMessage(messageData);

      const toRoom = `user:${toId}`;
      
      const roomSockets = io.sockets.adapter.rooms.get(toRoom);
      
      const allSockets = await io.fetchSockets();
      const receiverSocket = allSockets.find(s => s.userId === toId);
      
      const messagePayload = {
        ...message,
        fromType: socket.userType,
        toType
      };
      
      io.to(toRoom).emit('new_message', messagePayload);

      socket.emit('message_sent', messagePayload);

    } catch (error) {
      
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  socket.on('typing_message', (data) => {
    const { toId, isTyping } = data;
    const toRoom = `user:${toId}`;
    
    socket.to(toRoom).emit('user_typing_message', {
      fromId: socket.userId,
      fromType: socket.userType,
      isTyping: isTyping
    });
  });

  socket.on('join_conversation', (otherUserId) => {
    const conversationId = [socket.userId, otherUserId].sort().join('_');
    socket.join(`conversation_${conversationId}`);
  });

  socket.on('leave_conversation', (otherUserId) => {
    const conversationId = [socket.userId, otherUserId].sort().join('_');
    socket.leave(`conversation_${conversationId}`);
  });
  
  socket.on('disconnect', () => {
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
});
