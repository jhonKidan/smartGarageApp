import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AppointmentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.firstName || !formData.email || !formData.phone || !formData.description) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          description: formData.description,
        }),
      });

      const text = await response.text(); // Get raw response
      console.log("Raw response:", text); // Log for debugging
      let data;
      try {
        data = JSON.parse(text); // Attempt to parse as JSON
      } catch {
        throw new Error("Invalid response format: Expected JSON, got HTML.");
      }

      if (!response.ok) {
        throw new Error(data.error || `Failed to submit appointment. Status: ${response.status}`);
      }

      setSuccess(`Appointment scheduled successfully! (ID: ${data.appointmentId})`);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", description: "" });
      setTimeout(() => navigate("/"), 2000); // Redirect to home after 2 seconds
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      console.error("Submission error:", err);
    }
  };

  return (
    <section className="appointment-form-section" style={{ padding: "20px", backgroundColor: "#f4f7fa" }}>
      <div className="auto-container">
        <h2 style={{ color: "#1a2b49", textAlign: "center", marginBottom: "20px" }}>Schedule Your Appointment</h2>
        {error && <div style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{error}</div>}
        {success && <div style={{ color: "green", textAlign: "center", marginBottom: "10px" }}>{success}</div>}
        <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#1a2b49" }}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
              required
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#1a2b49" }}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#1a2b49" }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
              required
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#1a2b49" }}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
              required
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#1a2b49" }}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box", height: "100px" }}
              required
            />
          </div>
          <button
            type="submit"
            style={{ width: "100%", padding: "10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px" }}
          >
            Submit Appointment
          </button>
        </form>
      </div>
    </section>
  );
}

export default AppointmentForm;