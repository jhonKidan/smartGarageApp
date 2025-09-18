import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import serviceService from "../../services/service.service";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);

  useEffect(() => {
    // Fetch services using the public endpoint
    serviceService.getAllPublicServices()
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch services");
        return res.json();
      })
      .then((data) => {
        if (data && data.data) {
          setServices(data.data);
        } else {
          setServices([]);
        }
      })
      .catch((error) => {
        setApiError(true);
        setApiErrorMessage(error.message || "Error loading services");
      });
  }, []); // No dependencies, as no token is needed

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Services we provide</h2>
          <div className="text">
            Whether it’s a quick oil change, brake repair, or a complex engine check, our team is here to help. We make car maintenance easy, affordable, and stress-free.
          </div>
        </div>

        {apiError ? (
          <h3>{apiErrorMessage}</h3>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service.service_id}>
                    <td>{service.service_name}</td>
                    <td>{service.service_description || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>
                    No services found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
    </section>
  );
};

export default ServicesList;