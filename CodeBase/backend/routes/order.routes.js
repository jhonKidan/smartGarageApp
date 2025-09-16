const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require("../middlewares/auth.middleware");

// Create a new order (restricted to admins and receptionists)
router.post(
  "/api/orders",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  orderController.createOrder
);

// Get all orders (restricted to admins and receptionists)
router.get(
  "/api/orders",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  orderController.getAllOrders
);

// Update order status (restricted to admins)
router.patch(
  "/api/orders/:orderId/status",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  orderController.updateOrderStatus
);

// Assign mechanic to order (restricted to admins)
router.patch(
  "/api/orders/:orderId/assign",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  orderController.assignMechanic
);

// Get orders by employee (accessible to all authenticated employees)
router.get(
  "/api/orders/employee/:employeeId",
  [authMiddleware.verifyToken],
  orderController.getOrdersByEmployee
);

module.exports = router;