// Import the express module  
const express = require('express');
// Call the router method from express to create the router 
const router = express.Router();
// Import the employee controller
const employeeController = require('../controllers/employee.controller');
// Import middleware 
const authMiddleware = require("../middlewares/auth.middleware");

// Create a route to handle the add employee request on post
router.post("/api/employee", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.createEmployee);
// Create a route to handle the get all employees request on get
router.get("/api/employees", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.getAllEmployees);
// Create a route to handle the search employees request on get
router.get("/api/employees/search", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.searchEmployees);
// Create a route to handle the update employee request on put
router.put("/api/employee/:id", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.updateEmployee);
// Create a route to handle the delete employee request on delete
router.delete("/api/employee/:id", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.deleteEmployee);
// Export the router
module.exports = router;