const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const authMiddleware = require("../middlewares/auth.middleware");

// GET vehicles for a specific customer (accessible to admins and receptionists)
router.get(
  "/api/customers/:customerId/vehicles",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  vehicleController.getVehiclesByCustomer
);

// POST add a new vehicle for a customer (accessible to admins and receptionists)
router.post(
  "/api/customers/:customerId/vehicles",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  vehicleController.addVehicle
);

// PUT update a vehicle (accessible to admins and receptionists)
router.put(
  "/api/vehicles/:vehicleId",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  vehicleController.updateVehicle
);

// DELETE a vehicle (accessible to admins and receptionists)
router.delete(
  "/api/vehicles/:vehicleId",
  [authMiddleware.verifyToken, authMiddleware.isAdminOrReceptionist],
  vehicleController.deleteVehicle
);

module.exports = router;