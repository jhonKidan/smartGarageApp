
// Import the vehicle service
const vehicleService = require('../services/vehicle.service');

// Controller: Get Vehicles by Customer ID
async function getVehiclesByCustomer(req, res, next) {
  try {
    const { customerId } = req.params;
    const vehicles = await vehicleService.getVehiclesByCustomer(customerId);

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
    console.error("Error in getVehiclesByCustomer:", err);
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

    // Validate required fields
    if (!vehicleData.vehicle_year || !vehicleData.vehicle_make || !vehicleData.vehicle_model ||
        !vehicleData.vehicle_type || !vehicleData.vehicle_mileage || !vehicleData.vehicle_tag ||
        !vehicleData.vehicle_serial || !vehicleData.vehicle_color) {
      return res.status(400).json({
        status: "error",
        message: "All vehicle fields are required",
      });
    }

    const vehicle = await vehicleService.addVehicle(customerId, vehicleData);

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
    console.error("Error in addVehicle:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
}

// Export controllers
module.exports = {
  getVehiclesByCustomer,
  addVehicle,
};