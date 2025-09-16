const conn = require("../config/db.config");

// Create a new service
async function createService(service) {
  try {
    if (!service.service_name) {
      throw new Error("Service name is required");
    }

    const query = `
      INSERT INTO common_services (service_name, service_description) 
      VALUES (?, ?)
    `;
    const rows = await conn.query(query, [
      service.service_name,
      service.service_description || null,
    ]);

    if (rows.affectedRows !== 1) {
      console.error("Service: Failed to insert service:", service.service_name);
      throw new Error("Failed to insert service");
    }

    return {
      service_id: rows.insertId,
      service_name: service.service_name,
      service_description: service.service_description || null,
    };
  } catch (err) {
    console.error("Service Error creating service:", err.message, err.stack);
    throw err;
  }
}

// Get all services
async function getAllServices() {
  try {
    const query = `
      SELECT service_id, service_name, service_description
      FROM common_services
      ORDER BY service_id DESC
      LIMIT 20
    `;
    const rows = await conn.query(query);
    return rows;
  } catch (err) {
    console.error("Service Error in getAllServices:", err.message, err.stack);
    throw err;
  }
}

// Update service
async function updateService(id, serviceData) {
  try {
    if (!serviceData.service_name) {
      throw new Error("Service name is required");
    }

    const query = `
      UPDATE common_services 
      SET service_name = ?, service_description = ?
      WHERE service_id = ?
    `;
    const rows = await conn.query(query, [
      serviceData.service_name,
      serviceData.service_description || null,
      id,
    ]);

    if (rows.affectedRows !== 1) {
      console.error("Service: Failed to update service ID:", id);
      throw new Error("Service not found or update failed");
    }

    return {
      service_id: id,
      service_name: serviceData.service_name,
      service_description: serviceData.service_description || null,
    };
  } catch (err) {
    console.error("Service Error in updateService:", err.message, err.stack);
    throw err;
  }
}

// Delete service
async function deleteService(id) {
  try {
    const query = `
      DELETE FROM common_services 
      WHERE service_id = ?
    `;
    const rows = await conn.query(query, [id]);

    if (rows.affectedRows !== 1) {
      console.error("Service: Failed to delete service ID:", id);
      throw new Error("Service not found or deletion failed");
    }

    return true;
  } catch (err) {
    console.error("Service Error in deleteService:", err.message, err.stack);
    throw err;
  }
}

module.exports = {
  createService,
  getAllServices,
  updateService,
  deleteService,
};