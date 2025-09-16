const vehicleService = require('../services/vehicle.service');

// Controller: Get Vehicles by Customer ID
async function getVehiclesByCustomer(req, res, next) {
  try {
    const { customerId } = req.params;
    if (!customerId || isNaN(customerId)) {
      return res.status(400).json({
        status: "error",
        message: "Valid customer ID is required",
      });
    }

    const vehicles = await vehicleService.getVehiclesByCustomer(parseInt(customerId));
    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No vehicles found for this customer",
      });
    }

    res.status(200).json({
      status: "success",
      data: vehicles,
    });
  } catch (err) {
    console.error("Error in getVehiclesByCustomer:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch vehicles",
    });
  }
}

// Controller: Add Vehicle
async function addVehicle(req, res, next) {
  try {
    const { customerId } = req.params;
    const vehicleData = req.body;

    if (!customerId || isNaN(customerId)) {
      return res.status(400).json({
        status: "error",
        message: "Valid customer ID is required",
      });
    }

    // Validate required fields
    if (
      !vehicleData.vehicle_year ||
      !vehicleData.vehicle_make ||
      !vehicleData.vehicle_model ||
      !vehicleData.vehicle_type ||
      !vehicleData.vehicle_mileage ||
      !vehicleData.vehicle_tag ||
      !vehicleData.vehicle_serial ||
      !vehicleData.vehicle_color
    ) {
      return res.status(400).json({
        status: "error",
        message: "All vehicle fields are required (year, make, model, type, mileage, tag, serial, color)",
      });
    }

    const vehicle = await vehicleService.addVehicle(parseInt(customerId), vehicleData);
    if (!vehicle) {
      return res.status(400).json({
        status: "error",
        message: "Failed to add vehicle",
      });
    }

    res.status(201).json({
      status: "success",
      data: vehicle,
    });
  } catch (err) {
    console.error("Error in addVehicle:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to add vehicle",
    });
  }
}

// Controller: Update Vehicle
async function updateVehicle(req, res, next) {
  try {
    const { vehicleId } = req.params;
    const vehicleData = req.body;

    if (!vehicleId || isNaN(vehicleId)) {
      return res.status(400).json({
        status: "error",
        message: "Valid vehicle ID is required",
      });
    }

    // Validate required fields
    if (
      !vehicleData.vehicle_year ||
      !vehicleData.vehicle_make ||
      !vehicleData.vehicle_model ||
      !vehicleData.vehicle_type ||
      !vehicleData.vehicle_mileage ||
      !vehicleData.vehicle_tag ||
      !vehicleData.vehicle_serial ||
      !vehicleData.vehicle_color
    ) {
      return res.status(400).json({
        status: "error",
        message: "All vehicle fields are required (year, make, model, type, mileage, tag, serial, color)",
      });
    }

    const updated = await vehicleService.updateVehicle(parseInt(vehicleId), vehicleData);
    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Vehicle not found or update failed",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Vehicle updated successfully",
    });
  } catch (err) {
    console.error("Error in updateVehicle:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to update vehicle",
    });
  }
}

// Controller: Delete Vehicle
async function deleteVehicle(req, res, next) {
  try {
    const { vehicleId } = req.params;
    if (!vehicleId || isNaN(vehicleId)) {
      return res.status(400).json({
        status: "error",
        message: "Valid vehicle ID is required",
      });
    }

    const deleted = await vehicleService.deleteVehicle(parseInt(vehicleId));
    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Vehicle not found or deletion failed",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Vehicle deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteVehicle:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to delete vehicle",
    });
  }
}

module.exports = {
  getVehiclesByCustomer,
  addVehicle,
  updateVehicle,
  deleteVehicle,
};