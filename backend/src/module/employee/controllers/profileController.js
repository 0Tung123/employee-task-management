const employeeService = require('../../owner/services/employeeManagementService');

const GetMyProfile = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const employee = await employeeService.getEmployeeById(employeeId);
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      profile: employee
    });
  } catch (error) {
    if (error.message === 'Employee not found') {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
};

const GetMySchedules = async (req, res) => {
  try {
    const employeeId = req.user.userId;
    const { startDate, endDate } = req.body;
    const schedules = await employeeService.getEmployeeSchedules(employeeId, startDate, endDate);
    res.json({
      success: true,
      message: 'Schedules retrieved successfully',
      count: schedules.length,
      schedules: schedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get schedules'
    });
  }
};

module.exports = {
  GetMyProfile,
  GetMySchedules
};