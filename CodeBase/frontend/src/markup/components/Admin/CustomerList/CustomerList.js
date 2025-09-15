import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { useAuth } from "../../../../Contexts/AuthContext";
import { format } from "date-fns";
import customerService from "../../../../services/customer.service";
import CustomerSearchBar from "./CustomerSearchBar";

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customer_email: "",
    customer_phone_number: "",
    customer_first_name: "",
    customer_last_name: "",
    active_customer_status: true,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const { employee } = useAuth();
  let token = employee ? employee.employee_token : null;

  useEffect(() => {
    if (token) {
      customerService.getAllCustomers(token)
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((data) => {
          if (data && data.data) {
            setCustomers(data.data);
          }
        })
        .catch(() => {
          setApiError(true);
          setApiErrorMessage("Error loading customers");
        });
    }
  }, [token]);

  const handleSearch = async (query) => {
    try {
      const res = await customerService.searchCustomers(token, query);
      if (!res.ok) throw res;
      const data = await res.json();

      if (data && data.data) {
        setCustomers(Array.isArray(data.data) ? data.data : [data.data]);
      }
    } catch (error) {
      setApiError(true);
      setApiErrorMessage("Customer not found or error occurred");
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setEditFormData({
      customer_email: customer.customer_email,
      customer_phone_number: customer.customer_phone_number,
      customer_first_name: customer.customer_first_name,
      customer_last_name: customer.customer_last_name,
      active_customer_status: customer.active_customer_status,
    });
    setShowEditModal(true);
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await customerService.updateCustomer(token, editingCustomer.customer_id, editFormData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update customer");
      }
      setShowEditModal(false);
      setEditingCustomer(null);
      // Refresh the list
      const res = await customerService.getAllCustomers(token);
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) setCustomers(data.data);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      alert(error.message);
    }
  };

  const handleDelete = (customer) => {
    setDeletingCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleDeleteCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await customerService.deleteCustomer(token, deletingCustomer.customer_id);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete customer");
      }
      setShowDeleteModal(false);
      setDeletingCustomer(null);
      // Refresh the list
      const res = await customerService.getAllCustomers(token);
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) setCustomers(data.data);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert(error.message);
    }
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Customers</h2>
        </div>

        {/* Search bar component */}
        <CustomerSearchBar onSearch={handleSearch} />

        {apiError ? (
          <h3>{apiErrorMessage}</h3>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Active</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Added Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td>{customer.active_customer_status ? "Yes" : "No"}</td>
                    <td>{customer.customer_first_name}</td>
                    <td>{customer.customer_last_name}</td>
                    <td>{customer.customer_email}</td>
                    <td>{customer.customer_phone_number}</td>
                    <td>
                      {customer.customer_added_date
                        ? format(new Date(customer.customer_added_date), "MM-dd-yyyy | kk:mm")
                        : "-"}
                    </td>
                    <td>
                      <Button variant="primary" size="sm" onClick={() => handleEdit(customer)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(customer)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No customers found
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
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateCustomer}>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="customer_email"
                value={editFormData.customer_email}
                onChange={(e) => setEditFormData({ ...editFormData, customer_email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="customer_phone_number"
                value={editFormData.customer_phone_number}
                onChange={(e) => setEditFormData({ ...editFormData, customer_phone_number: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="customer_first_name"
                value={editFormData.customer_first_name}
                onChange={(e) => setEditFormData({ ...editFormData, customer_first_name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="customer_last_name"
                value={editFormData.customer_last_name}
                onChange={(e) => setEditFormData({ ...editFormData, customer_last_name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={editFormData.active_customer_status}
                onChange={(e) => setEditFormData({ ...editFormData, active_customer_status: e.target.checked })}
              />
            </Form.Group>
            <Button type="submit" className="mt-2">Update Customer</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete{" "}
            {deletingCustomer
              ? `${deletingCustomer.customer_first_name} ${deletingCustomer.customer_last_name}`
              : ""}
            ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCustomer}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default CustomersList;


