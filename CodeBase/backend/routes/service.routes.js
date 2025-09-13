// Import the express module
const express = require('express');
const router = express.Router();

// Import controller
const serviceController = require('../controllers/service.controller');

// Auth middleware (if needed, same as customer)
const authMiddleware = require("../middlewares/auth.middleware");

// Create service route
router.post("/api/service", serviceController.createService);

module.exports = router;
