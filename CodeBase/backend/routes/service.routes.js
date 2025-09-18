const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const authMiddleware = require("../middlewares/auth.middleware");

// Create service (restricted to admins and receptionists)
router.post(
  "/api/service",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  serviceController.createService
);

// Get all services (restricted to admins and receptionists)
router.get(
  "/api/services",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  serviceController.getAllServices
);

// NEW: Public endpoint to get all services (no authentication required)
router.get(
  "/api/public/services",
  serviceController.getAllServices
);

// Update service (restricted to admins and receptionists)
router.put(
  "/api/service/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  serviceController.updateService
);

// Delete service (restricted to admins and receptionists)
router.delete(
  "/api/service/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  serviceController.deleteService
);

module.exports = router;