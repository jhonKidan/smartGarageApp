const serviceService = require('../services/service.service');

// Create service
async function createService(req, res, next) {
  try {
    const { service_name, service_description } = req.body;

    if (!service_name) {
      return res.status(400).json({
        status: "error",
        message: "Service name is required",
      });
    }

    const newService = await serviceService.createService({
      service_name,
      service_description: service_description || null,
    });

    if (!newService) {
      return res.status(400).json({
        status: "error",
        message: "Failed to create service",
      });
    }

    res.status(201).json({
      status: "success",
      message: "Service created successfully",
      data: newService,
    });
  } catch (err) {
    console.error("Error in createService:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to create service",
    });
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
    console.error("Error in getAllServices:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch services",
    });
  }
}

// Update service
async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    const { service_name, service_description } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "Valid service ID is required",
      });
    }

    if (!service_name) {
      return res.status(400).json({
        status: "error",
        message: "Service name is required",
      });
    }

    const updatedService = await serviceService.updateService(parseInt(id), {
      service_name,
      service_description: service_description || null,
    });

    if (!updatedService) {
      return res.status(404).json({
        status: "error",
        message: "Service not found or update failed",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (err) {
    console.error("Error in updateService:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to update service",
    });
  }
}

// Delete service
async function deleteService(req, res, next) {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "Valid service ID is required",
      });
    }

    const deleted = await serviceService.deleteService(parseInt(id));
    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Service not found or deletion failed",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Service deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteService:", err.message, err.stack);
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