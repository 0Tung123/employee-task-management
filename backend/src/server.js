require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { db } = require('./configs/firebase.config');

const authRoutes = require('./module/auth/routes/authRoutes');
const setupRoutes = require('./module/auth/routes/setupRoutes');
const ownerEmployeeRoutes = require('./module/owner/routes/employeeRoutes');
const employeeProfileRoutes = require('./module/employee/routes/profileRoutes');
const smsRoutes = require('./module/sms/routes/smsRoutes');
const emailRoutes = require('./module/email/routes/emailRoutes');

const app = express();

app.use(cors());
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
});