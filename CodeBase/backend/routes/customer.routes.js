// Import the express module  
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const authMiddleware = require("../middlewares/auth.middleware");

// Create a route to handle the add customer request on post (now protected)
router.post(
  "/api/customer", 
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  customerController.createCustomer
);

// GET all customers (now allows admins and receptionists)
router.get(
  "/api/customers",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  customerController.getAllCustomers
);

// 🔹 NEW: Search customers by name, phone, or email (now allows admins and receptionists)
router.get(
  "/api/customers/search",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  customerController.searchCustomers
);

// NEW: Update customer (now allows admins and receptionists)
router.put(
  "/api/customer/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  customerController.updateCustomer
);

// NEW: Delete customer (now allows admins and receptionists)
router.delete(
  "/api/customer/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  customerController.deleteCustomer
);

module.exports = router;