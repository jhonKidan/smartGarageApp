// Import the express module  
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const authMiddleware = require("../middlewares/auth.middleware");

// Create a route to handle the add customer request on post
router.post("/api/customer", customerController.createCustomer);

// GET all customers (only admin allowed)
router.get(
  "/api/customers",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.getAllCustomers
);

// 🔹 NEW: Search customers by name, phone, or email
router.get(
  "/api/customers/search",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.searchCustomers
);

module.exports = router;
