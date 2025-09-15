import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { useAuth } from "../../../../Contexts/AuthContext";
import serviceService from "../../../../services/service.service";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editFormData, setEditFormData] = useState({
    service_name: "",
    service_description: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingService, setDeletingService] = useState(null);

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

  const handleEdit = (service) => {
    setEditingService(service);
    setEditFormData({
      service_name: service.service_name,
      service_description: service.service_description || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      const response = await serviceService.updateService(token, editingService.service_id, editFormData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update service");
      }
      setShowEditModal(false);
      setEditingService(null);
      // Refresh the list
      const res = await serviceService.getAllServices(token);
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) setServices(data.data);
      }
    } catch (error) {
      console.error("Error updating service:", error);
      alert(error.message);
    }
  };

  const handleDelete = (service) => {
    setDeletingService(service);
    setShowDeleteModal(true);
  };

  const handleDeleteService = async (e) => {
    e.preventDefault();
    try {
      const response = await serviceService.deleteService(token, deletingService.service_id);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete service");
      }
      setShowDeleteModal(false);
      setDeletingService(null);
      // Refresh the list
      const res = await serviceService.getAllServices(token);
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) setServices(data.data);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert(error.message);
    }
  };

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service.service_id}>
                    <td>{service.service_name}</td>
                    <td>{service.service_description || "-"}</td>
                    <td>
                      <Button variant="primary" size="sm" onClick={() => handleEdit(service)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(service)}>
                        Delete
                      </Button>
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateService}>
            <Form.Group className="mb-2">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                name="service_name"
                value={editFormData.service_name}
                onChange={(e) => setEditFormData({ ...editFormData, service_name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="service_description"
                value={editFormData.service_description}
                onChange={(e) => setEditFormData({ ...editFormData, service_description: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" className="mt-2">Update Service</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete {deletingService ? `"${deletingService.service_name}"` : ""}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteService}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default ServicesList;
