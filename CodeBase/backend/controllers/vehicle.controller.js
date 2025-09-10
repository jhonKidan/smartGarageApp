// const vehicleService = require('../services/vehicle.service');

// // Create vehicle
// async function createVehicle(req, res) {
//   try {
//     const vehicleId = await vehicleService.createVehicle(req.body);
//     res.status(201).json({ message: 'Vehicle added successfully', vehicleId });
//   } catch (error) {
//     console.error('Error creating vehicle:', error);
//     res.status(500).json({ error: 'Failed to create vehicle' });
//   }
// }

// // Get all vehicles
// async function getVehicles(req, res) {
//   try {
//     const vehicles = await vehicleService.getVehicles();
//     res.status(200).json(vehicles);
//   } catch (error) {
//     console.error('Error fetching vehicles:', error);
//     res.status(500).json({ error: 'Failed to fetch vehicles' });
//   }
// }

// // Get vehicles by customer
// async function getVehiclesByCustomer(req, res) {
//   try {
//     const { customerId } = req.params;
//     const vehicles = await vehicleService.getVehiclesByCustomer(customerId);
//     res.status(200).json(vehicles);
//   } catch (error) {
//     console.error('Error fetching customer vehicles:', error);
//     res.status(500).json({ error: 'Failed to fetch customer vehicles' });
//   }
// }

// // Update vehicle
// async function updateVehicle(req, res) {
//   try {
//     const { id } = req.params;
//     const updated = await vehicleService.updateVehicle(id, req.body);

//     if (!updated) {
//       return res.status(404).json({ error: 'Vehicle not found' });
//     }

//     res.status(200).json({ message: 'Vehicle updated successfully' });
//   } catch (error) {
//     console.error('Error updating vehicle:', error);
//     res.status(500).json({ error: 'Failed to update vehicle' });
//   }
// }

// // Delete vehicle
// async function deleteVehicle(req, res) {
//   try {
//     const { id } = req.params;
//     const deleted = await vehicleService.deleteVehicle(id);

//     if (!deleted) {
//       return res.status(404).json({ error: 'Vehicle not found' });
//     }

//     res.status(200).json({ message: 'Vehicle deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting vehicle:', error);
//     res.status(500).json({ error: 'Failed to delete vehicle' });
//   }
// }

// module.exports = {
//   createVehicle,
//   getVehicles,
//   getVehiclesByCustomer,
//   updateVehicle,
//   deleteVehicle
// };
