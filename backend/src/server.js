require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { db } = require('./configs/firebase.config');
const smsRoutes = require('./module/sms/routes/smsRoutes');
const employeeRoutes = require('./module/employee/routes/employeeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Employee Task Management API',
    version: '1.0',
    status: 'Running'
  });
});

app.use('/api/sms', smsRoutes);

app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Firebase connected successfully!`);
});