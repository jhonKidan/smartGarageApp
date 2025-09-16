import React, { useEffect, useState } from "react";

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/appointments/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete appointment");
      }

      alert("Appointment deleted successfully");
      fetchAppointments(); // Refresh list after deletion
    } catch (err) {
      alert(err.message || "Error deleting appointment");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading appointments...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <section style={{ padding: "20px", backgroundColor: "#f4f7fa" }}>
      <div className="auto-container">
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#1a2b49" }}>
          All Appointments
        </h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead style={{ backgroundColor: "#1a2b49", color: "#fff" }}>
            <tr>
              <th style={{ padding: "10px" }}>ID</th>
              <th style={{ padding: "10px" }}>First Name</th>
              <th style={{ padding: "10px" }}>Last Name</th>
              <th style={{ padding: "10px" }}>Email</th>
              <th style={{ padding: "10px" }}>Phone</th>
              <th style={{ padding: "10px" }}>Description</th>
              <th style={{ padding: "10px" }}>Created At</th>
              <th style={{ padding: "10px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <tr key={appt.appointment_id}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{appt.appointment_id}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{appt.first_name}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{appt.last_name}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{appt.email}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{appt.phone}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>{appt.description}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    {new Date(appt.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    <button
                      onClick={() => handleDelete(appt.appointment_id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#0A101B",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AppointmentList;
