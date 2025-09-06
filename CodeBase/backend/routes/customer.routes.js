// Import the express module  
const express = require('express');
// Call the router method from express to create the router 
const router = express.Router();
// Import the customer controller
const customerController = require('../controllers/customer.controller');
// Import middleware
const authMiddleware = require("../middlewares/auth.middleware");
// Create a route to handle the add customer request on post
router.post("/api/customer", customerController.createCustomer);
// GET all customers (only admin allowed)
router.get(
  "/api/customers",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.getAllCustomers
);
//Export the router
module.exports = router;