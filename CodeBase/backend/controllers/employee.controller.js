// Import the employee service 
const employeeService = require('../services/employee.service');
// Create the add employee controller
async function createEmployee(req, res, next) {
  // Check if employee email already exists in the database 
  const employeeExists = await employeeService.checkIfEmployeeExists(req.body.employee_email);
  // If employee exists, send a response to the client
  if (employeeExists) {
    res.status(400).json({
      error: "This email address is already associated with another employee!"
    });
  } else {
    try {
      const employeeData = req.body;
      // Create the employee
      const employee = await employeeService.createEmployee(employeeData);
      if (!employee) {
        res.status(400).json({
          error: "Failed to add the employee!"
        });
      } else {
        res.status(200).json({
          status: "true",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: "Something went wrong!"
      });
    }
  }
}

// Create the getAllEmployees controller 
async function getAllEmployees(req, res, next) {
  // Call the getAllEmployees method from the employee service 
  const employees = await employeeService.getAllEmployees();
  if (!employees) {
    res.status(400).json({
      error: "Failed to get all employees!"
    });
  } else {
    res.status(200).json({
      status: "success",
      data: employees,
    });
  }
}

// Create the searchEmployees controller 
async function searchEmployees(req, res, next) {
  const searchTerm = req.query.q; // Get search term from query parameter 'q'
  if (!searchTerm) {
    return res.status(400).json({ error: "Search term is required" });
  }
  try {
    const employees = await employeeService.searchEmployees(searchTerm);
    res.status(200).json({
      status: "success",
      data: employees,
    });
  } catch (error) {
    console.error("Error searching employees:", error);
    res.status(500).json({ error: "Failed to search employees" });
  }
}

// Create the updateEmployee controller 
async function updateEmployee(req, res, next) {
  const { id } = req.params;
  const employeeData = req.body;
  try {
    const employee = await employeeService.updateEmployee(id, employeeData);
    if (!employee) {
      res.status(404).json({
        error: "Employee not found!"
      });
    } else {
      res.status(200).json({
        status: "success",
        data: employee,
      });
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Failed to update employee" });
  }
}

// Create the deleteEmployee controller 
async function deleteEmployee(req, res, next) {
  const { id } = req.params;
  try {
    const deleted = await employeeService.deleteEmployee(id);
    if (!deleted) {
      res.status(404).json({
        error: "Employee not found!"
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Employee deleted successfully",
      });
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Failed to delete employee" });
  }
}

// Export the createEmployee controller 
module.exports = {
  createEmployee,
  getAllEmployees,
  searchEmployees,
  updateEmployee,
  deleteEmployee
};