import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useAuth } from "../../../../Contexts/AuthContext";
import serviceService from "../../../../services/service.service";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);

  const { employee } = useAuth();
  let token = employee ? employee.employee_token : null;

  useEffect(() => {
    if (token) {
      serviceService.getAllServices(token)
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((data) => {
          if (data && data.data) {
            setServices(data.data);
          }
        })
        .catch(() => {
          setApiError(true);
          setApiErrorMessage("Error loading services");
        });
    }
  }, [token]);

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Services we provide</h2>
           <div className="text">Whether it’s a quick oil change, brake repair, or a complex engine check, our team is here to help. We make car maintenance easy, affordable, and stress-free.
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
                <th>Edit/Delete</th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service.service_id}>
                    <td>{service.service_name}</td>
                    <td>{service.service_description || "-"}</td>
                    <td>
                      <div className="edit-delete-icons">
                        edit | delete
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
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
