const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../../../middleware/auth.middleware');

router.use(authenticateToken);

router.post('/create', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/stats', taskController.getTaskStats);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;