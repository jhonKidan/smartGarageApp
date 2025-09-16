const conn = require("../config/db.config");

// Get Vehicles by Customer ID
async function getVehiclesByCustomer(customerId) {
  try {
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
  } catch (err) {
    console.error("Service Error in getVehiclesByCustomer:", err.message, err.stack);
    throw err;
  }
}

// Add a new vehicle
async function addVehicle(customerId, vehicle) {
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
      vehicle.vehicle_color,
    ]);

    if (rows.affectedRows !== 1) {
      console.error("Service: Failed to insert vehicle for customerId:", customerId);
      return false;
    }

    const createdVehicle = {
      vehicle_id: rows.insertId,
      customer_id: customerId,
      ...vehicle,
    };
    return createdVehicle;
  } catch (err) {
    console.error("Service Error in addVehicle:", err.message, err.stack);
    throw err;
  }
}

// Get Vehicle by ID
async function getVehicleById(vehicleId) {
  try {
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
      WHERE vehicle_id = ?
    `;
    const rows = await conn.query(query, [vehicleId]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("Service Error in getVehicleById:", err.message, err.stack);
    throw err;
  }
}

// Update a vehicle
async function updateVehicle(vehicleId, vehicle) {
  try {
    const query = `
      UPDATE customer_vehicle_info
      SET 
        customer_id = ?,
        vehicle_year = ?,
        vehicle_make = ?,
        vehicle_model = ?,
        vehicle_type = ?,
        vehicle_mileage = ?,
        vehicle_tag = ?,
        vehicle_serial = ?,
        vehicle_color = ?
      WHERE vehicle_id = ?
    `;
    const rows = await conn.query(query, [
      vehicle.customer_id || null, // Allow null if not updating customer_id
      vehicle.vehicle_year,
      vehicle.vehicle_make,
      vehicle.vehicle_model,
      vehicle.vehicle_type,
      vehicle.vehicle_mileage,
      vehicle.vehicle_tag,
      vehicle.vehicle_serial,
      vehicle.vehicle_color,
      vehicleId,
    ]);

    return rows.affectedRows > 0;
  } catch (err) {
    console.error("Service Error in updateVehicle:", err.message, err.stack);
    throw err;
  }
}

// Delete a vehicle
async function deleteVehicle(vehicleId) {
  try {
    const query = `
      DELETE FROM customer_vehicle_info
      WHERE vehicle_id = ?
    `;
    const rows = await conn.query(query, [vehicleId]);
    return rows.affectedRows > 0;
  } catch (err) {
    console.error("Service Error in deleteVehicle:", err.message, err.stack);
    throw err;
  }
}

module.exports = {
  getVehiclesByCustomer,
  addVehicle,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};