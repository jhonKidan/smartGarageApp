const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const authMiddleware = require("../middlewares/auth.middleware");

// Create service
router.post("/api/service", serviceController.createService);

// Get all services (only admin allowed)
router.get(
  "/api/services",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  serviceController.getAllServices
);

// NEW: Update service
router.put(
  "/api/service/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  serviceController.updateService
);

// NEW: Delete service
router.delete(
  "/api/service/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  serviceController.deleteService
);

module.exports = router;
