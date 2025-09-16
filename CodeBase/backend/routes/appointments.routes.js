const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointments.controller");

// Create appointment
router.post("/api/appointments", appointmentsController.createAppointment);

// Get all appointments
router.get("/api/appointments", appointmentsController.getAppointments);

// Delete appointment
router.delete("/api/appointments/:id", appointmentsController.deleteAppointment);

module.exports = router;
