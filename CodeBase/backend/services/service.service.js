
const conn = require("../config/db.config");

// Create a new service
async function createService(service) {
  try {
    const query = `
      INSERT INTO common_services (service_name, service_description) 
      VALUES (?, ?)
    `;
    const rows = await conn.query(query, [
      service.service_name,
      service.service_description || null
    ]);

    if (rows.affectedRows !== 1) return false;

    return {
      service_id: rows.insertId,
      service_name: service.service_name,
      service_description: service.service_description
    };
  } catch (err) {
    console.error("Error creating service:", err);
    return false;
  }
}

// Get all services
async function getAllServices() {
  const query = `
    SELECT service_id, service_name, service_description
    FROM common_services
    ORDER BY service_id DESC
    LIMIT 20;
  `;
  const rows = await conn.query(query);
  return rows;
}

module.exports = {
  createService,
  getAllServices
};
