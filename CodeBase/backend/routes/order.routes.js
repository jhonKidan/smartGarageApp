const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require("../middlewares/auth.middleware");

// Create a new order (requires authentication)
router.post(
  "/api/orders",
  [authMiddleware.verifyToken],
  orderController.createOrder
);

// Get all orders (requires authentication)
router.get(
  "/api/orders",
  [authMiddleware.verifyToken],
  orderController.getAllOrders
);

// Update order status (requires authentication)
router.patch(
  "/api/orders/:orderId/status",
  [authMiddleware.verifyToken],
  orderController.updateOrderStatus
);

module.exports = router;