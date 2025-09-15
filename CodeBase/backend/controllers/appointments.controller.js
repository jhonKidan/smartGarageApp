const db = require("../config/db.config");

exports.createAppointment = async (req, res) => {
  const { firstName, lastName, email, phone, description } = req.body;

  try {
    // Validate required fields
    if (!firstName || !email || !phone || !description) {
      return res.status(400).json({ error: "All fields (firstName, email, phone, description) are required." });
    }

    // Check if customer exists by email
    let customerId = null;
    try {
      const results = await db.query(
        "SELECT customer_id FROM customer_identifier WHERE customer_email = ?",
        [email]
      );
      console.log("Query result for customer lookup:", results); // Debug log
      if (results && Array.isArray(results) && results.length > 0) {
        customerId = results[0].customer_id;
      } else if (!results || !Array.isArray(results)) {
        throw new Error("Invalid query result format");
      }
    } catch (dbError) {
      console.error("Database query error:", dbError);
      throw new Error("Failed to check existing customer");
    }

    const query = `
      INSERT INTO appointments (customer_id, first_name, last_name, email, phone, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [customerId, firstName, lastName, email, phone, description];
    const result = await db.query(query, values);

    res.status(201).json({ message: "Appointment scheduled successfully", appointmentId: result.insertId });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: error.message || "Failed to schedule appointment" });
  }
};