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

// NEW: Update service
async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    const { service_name, service_description } = req.body;

    if (!service_name) {
      return res.status(400).json({ error: "Service name is required!" });
    }

    const updatedService = await serviceService.updateService(id, { service_name, service_description });
    if (!updatedService) {
      return res.status(404).json({
        status: "error",
        message: "Service not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (err) {
    console.error("Error in updateService:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to update service",
    });
  }
}

// NEW: Delete service
async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await serviceService.deleteService(id);
    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Service not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Service deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteService:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to delete service",
    });
  }
}

module.exports = {
  createService,
  getAllServices,
  updateService,
  deleteService,
};
