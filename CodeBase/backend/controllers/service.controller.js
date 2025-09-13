const serviceService = require('../services/service.service');

// Create service
async function createService(req, res, next) {
  try {
    const { service_name, service_description } = req.body;

    if (!service_name) {
      return res.status(400).json({ error: "Service name is required!" });
    }

    const newService = await serviceService.createService({
      service_name,
      service_description
    });

    if (!newService) {
      return res.status(400).json({ error: "Failed to add service!" });
    }

    res.status(200).json({
      status: true,
      message: "Service added successfully",
      service: newService
    });
  } catch (error) {
    console.error("Error in createService:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}

// Get all services
async function getAllServices(req, res, next) {
  try {
    const services = await serviceService.getAllServices();

    if (!services || services.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No services found",
      });
    }

    res.status(200).json({
      status: "success",
      data: services,
    });
  } catch (err) {
    console.error("Error in getAllServices:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch services",
    });
  }
}

module.exports = {
  createService,
  getAllServices
};

