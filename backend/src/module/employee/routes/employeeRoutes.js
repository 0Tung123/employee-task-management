const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.post('/', employeeController.createEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

router.post('/:id/schedule', employeeController.addSchedule);
router.put('/:id/schedule/:scheduleIndex', employeeController.updateSchedule);
router.delete('/:id/schedule/:scheduleIndex', employeeController.deleteSchedule);

module.exports = router;