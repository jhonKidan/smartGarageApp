// Import service layer
const serviceService = require('../services/service.service');

// Create service controller
async function createService(req, res, next) {
  try {
    const { service_name, service_description } = req.body;

    // Simple validation
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
    console.error(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
}

module.exports = {
  createService,
};
