// //import db config
// const db = require("../config/db.config");

// // Create vehicle
// async function createVehicle(vehicle) {
//   const query = `
//     INSERT INTO customer_vehicle_info 
//     (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color) 
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const [result] = await db.query(query, [
//     vehicle.customer_id,
//     vehicle.vehicle_year,
//     vehicle.vehicle_make,
//     vehicle.vehicle_model,
//     vehicle.vehicle_type,
//     vehicle.vehicle_mileage,
//     vehicle.vehicle_tag,
//     vehicle.vehicle_serial,
//     vehicle.vehicle_color
//   ]);

//   return result.insertId;
// }

// // Get all vehicles
// async function getVehicles() {
//   const [rows] = await db.query('SELECT * FROM customer_vehicle_info');
//   return rows;
// }

// // Get vehicles by customer ID
// async function getVehiclesByCustomer(customerId) {
//   const [rows] = await db.query(
//     'SELECT * FROM customer_vehicle_info WHERE customer_id = ?',
//     [customerId]
//   );
//   return rows;
// }

// // Update vehicle
// async function updateVehicle(vehicleId, data) {
//   const query = `
//     UPDATE customer_vehicle_info 
//     SET vehicle_year=?, vehicle_make=?, vehicle_model=?, vehicle_type=?, vehicle_mileage=?, vehicle_tag=?, vehicle_serial=?, vehicle_color=?
//     WHERE vehicle_id=?
//   `;

//   const [result] = await db.query(query, [
//     data.vehicle_year,
//     data.vehicle_make,
//     data.vehicle_model,
//     data.vehicle_type,
//     data.vehicle_mileage,
//     data.vehicle_tag,
//     data.vehicle_serial,
//     data.vehicle_color,
//     vehicleId
//   ]);

//   return result.affectedRows;
// }

// // Delete vehicle
// async function deleteVehicle(vehicleId) {
//   const [result] = await db.query(
//     'DELETE FROM customer_vehicle_info WHERE vehicle_id = ?',
//     [vehicleId]
//   );
//   return result.affectedRows;
// }

// module.exports = {
//   createVehicle,
//   getVehicles,
//   getVehiclesByCustomer,
//   updateVehicle,
//   deleteVehicle
// };
