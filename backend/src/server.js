require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { db } = require('./configs/firebase.config');

// Import routes
const authRoutes = require('./module/auth/routes/authRoutes');
const setupRoutes = require('./module/auth/routes/setupRoutes');
const ownerEmployeeRoutes = require('./module/owner/routes/employeeRoutes');
const employeeProfileRoutes = require('./module/employee/routes/profileRoutes');
const smsRoutes = require('./module/sms/routes/smsRoutes');
const emailRoutes = require('./module/email/routes/emailRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Employee Task Management API',
    version: '2.0',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// ==================== API ROUTES ====================

// Public authentication routes (no middleware required)
app.use('/api/auth', authRoutes);

// Public setup routes (no middleware required)
app.use('/api/setup', setupRoutes);

// Owner routes (requires Owner role)
app.use('/api/owner', ownerEmployeeRoutes);

// Employee routes (requires Employee role)  
app.use('/api/employee', employeeProfileRoutes);

// Utility routes (can be used by both roles with proper authentication)
app.use('/api/sms', smsRoutes);
app.use('/api/email', emailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Firebase connected successfully!`);
});