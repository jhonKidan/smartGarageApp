const db = require("../config/db.config");

// ================== Create Appointment ==================
exports.createAppointment = async (req, res) => {
  const { firstName, lastName, email, phone, description } = req.body;

  try {
    if (!firstName || !email || !phone || !description) {
      return res
        .status(400)
        .json({ error: "All fields (firstName, email, phone, description) are required." });
    }

    // Check if customer exists by email
    let customerId = null;
    const results = await db.query(
      "SELECT customer_id FROM customer_identifier WHERE customer_email = ?",
      [email]
    );

    if (results && Array.isArray(results) && results.length > 0) {
      customerId = results[0].customer_id;
    }

    const query = `
      INSERT INTO appointments (customer_id, first_name, last_name, email, phone, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [customerId, firstName, lastName, email, phone, description];
    const result = await db.query(query, values);

    res.status(201).json({
      message: "Appointment scheduled successfully",
      appointmentId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: error.message || "Failed to schedule appointment" });
  }
};

// ================== Get All Appointments ==================
exports.getAppointments = async (req, res) => {
  try {
    const query = `
      SELECT * FROM appointments ORDER BY created_at DESC
    `;
    const results = await db.query(query);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: error.message || "Failed to fetch appointments" });
  }
};

// ================== Delete Appointment ==================
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM appointments WHERE appointment_id = ?";
    const result = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: error.message || "Failed to delete appointment" });
  }
};
