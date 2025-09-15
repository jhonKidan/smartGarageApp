const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointments.controller");

router.post("/api/appointments", appointmentsController.createAppointment);

module.exports = router;