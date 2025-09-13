// Import the query function from the db.config.js file 
const conn = require("../config/db.config");

// Get Vehicles by Customer ID
async function getVehiclesByCustomer(customerId) {
  const query = `
    SELECT 
      vehicle_id,
      customer_id,
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial,
      vehicle_color
    FROM customer_vehicle_info 
    WHERE customer_id = ?
    ORDER BY vehicle_id DESC
  `;

  const rows = await conn.query(query, [customerId]);
  return rows;
}

// Add a new vehicle
async function addVehicle(customerId, vehicle) {
  let createdVehicle = {};
  try {
    const query = `
      INSERT INTO customer_vehicle_info (
        customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, 
        vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const rows = await conn.query(query, [
      customerId,
      vehicle.vehicle_year,
      vehicle.vehicle_make,
      vehicle.vehicle_model,
      vehicle.vehicle_type,
      vehicle.vehicle_mileage,
      vehicle.vehicle_tag,
      vehicle.vehicle_serial,
      vehicle.vehicle_color
    ]);

    if (rows.affectedRows !== 1) {
      return false;
    }

    createdVehicle = {
      vehicle_id: rows.insertId,
      ...vehicle,
      customer_id: customerId
    };
  } catch (err) {
    console.error("Error adding vehicle:", err);
  }

  return createdVehicle;
}

// Export the functions
module.exports = {
  getVehiclesByCustomer,
  addVehicle,
};