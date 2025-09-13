// Import the express module  
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const authMiddleware = require("../middlewares/auth.middleware");

// GET vehicles for a specific customer (admin only)
router.get(
  "/api/customers/:customerId/vehicles",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  vehicleController.getVehiclesByCustomer
);

// POST add a new vehicle for a customer (admin only)
router.post(
  "/api/customers/:customerId/vehicles",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  vehicleController.addVehicle
);

module.exports = router;