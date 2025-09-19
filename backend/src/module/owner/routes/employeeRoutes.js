const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticateToken, requireOwner } = require('../../../middleware/auth.middleware');

router.use(authenticateToken);
router.use(requireOwner);

router.post('/GetEmployee', employeeController.GetEmployee);
router.post('/CreateEmployee', employeeController.CreateEmployee);
router.post('/UpdateEmployee', employeeController.UpdateEmployee);
router.post('/DeleteEmployee', employeeController.DeleteEmployee);
router.post('/SetSchedule', employeeController.SetSchedule);
router.get('/employees', employeeController.GetAllEmployees);
router.post('/GetEmployeeSchedules', employeeController.GetEmployeeSchedules);

module.exports = router;