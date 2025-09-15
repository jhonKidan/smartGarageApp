// Import the necessary components 
import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
// Import the auth hook  
import { useAuth } from "../../../../Contexts/AuthContext";
// Import the date-fns library 
import { format } from "date-fns"; // To properly format the date on the table 
// Import the employee service functions  
import employeeService from "../../../../services/employee.service";
import "../../../../assets/styles/custom.css";

// Create the EmployeesList component 
const EmployeesList = () => {
  // Create all the states we need to store the data
  // Create the employees state to store the employees data  
  const [employees, setEmployees] = useState([]);
  // A state to serve as a flag to show the error message 
  const [apiError, setApiError] = useState(false);
  // A state to store the error message 
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  // Search term state
  const [searchTerm, setSearchTerm] = useState("");
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  // Employee to edit state
  const [editingEmployee, setEditingEmployee] = useState(null);
  // Form data for edit
  const [editFormData, setEditFormData] = useState({
    employee_email: "",
    employee_first_name: "",
    employee_last_name: "",
    employee_phone: "",
    company_role_id: "",
    active_employee: true
  });
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  // To get the logged in employee token
  const { employee } = useAuth();
  let token = null; // To store the token 
  if (employee) {
    token = employee.employee_token;
  }

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm]); // Trigger on searchTerm change

  const fetchEmployees = async () => {
    try {
      let response;
      if (searchTerm.trim()) {
        response = await employeeService.searchEmployees(token, searchTerm.trim());
      } else {
        response = await employeeService.getAllEmployees(token);
      }

      if (!response.ok) {
        setApiError(true);
        if (response.status === 401) {
          setApiErrorMessage("Please login again");
        } else if (response.status === 403) {
          setApiErrorMessage("You are not authorized to view this page");
        } else {
          setApiErrorMessage("Please try again later");
        }
        return;
      }

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setEmployees(data.data);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      setApiError(true);
      setApiErrorMessage("An error occurred while fetching employees");
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      employee_email: employee.employee_email,
      employee_first_name: employee.employee_first_name,
      employee_last_name: employee.employee_last_name,
      employee_phone: employee.employee_phone,
      company_role_id: employee.company_role_id,
      active_employee: employee.active_employee
    });
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await employeeService.updateEmployee(token, editingEmployee.employee_id, editFormData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update employee");
      }
      setShowEditModal(false);
      setEditingEmployee(null);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error("Error updating employee:", error);
      alert(error.message);
    }
  };

  const handleDelete = (employee) => {
    setDeletingEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await employeeService.deleteEmployee(token, deletingEmployee.employee_id);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete employee");
      }
      setShowDeleteModal(false);
      setDeletingEmployee(null);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert(error.message);
    }
  };

  return (
    <>
      {apiError ? (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>{apiErrorMessage}</h2>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="contact-section">
            <div className="auto-container">
              <div className="contact-title">
                <h2>Employees</h2>
                <Form className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ maxWidth: "300px" }}
                  />
                </Form>
              </div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Active</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Added Date</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.employee_id}>
                      <td>{employee.active_employee ? "Yes" : "No"}</td>
                      <td>{employee.employee_first_name}</td>
                      <td>{employee.employee_last_name}</td>
                      <td>{employee.employee_email}</td>
                      <td>{employee.employee_phone}</td>
                      <td>{format(new Date(employee.added_date), "MM - dd - yyyy | kk:mm")}</td>
                      <td>{employee.company_role_name}</td>
                      <td>
                        <Button variant="primary" size="sm" onClick={() => handleEdit(employee)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(employee)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </section>

          {/* Edit Modal */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleUpdateEmployee}>
                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="employee_email"
                    value={editFormData.employee_email}
                    onChange={(e) => setEditFormData({ ...editFormData, employee_email: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="employee_first_name"
                    value={editFormData.employee_first_name}
                    onChange={(e) => setEditFormData({ ...editFormData, employee_first_name: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="employee_last_name"
                    value={editFormData.employee_last_name}
                    onChange={(e) => setEditFormData({ ...editFormData, employee_last_name: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="employee_phone"
                    value={editFormData.employee_phone}
                    onChange={(e) => setEditFormData({ ...editFormData, employee_phone: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="company_role_id"
                    value={editFormData.company_role_id}
                    onChange={(e) => setEditFormData({ ...editFormData, company_role_id: e.target.value })}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="1">Employee</option>
                    <option value="2">Manager</option>
                    <option value="3">Admin</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label="Active"
                    checked={editFormData.active_employee}
                    onChange={(e) => setEditFormData({ ...editFormData, active_employee: e.target.checked })}
                  />
                </Form.Group>
                <Button type="submit" className="mt-2">Update Employee</Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Delete Modal */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to delete {deletingEmployee ? `${deletingEmployee.employee_first_name} ${deletingEmployee.employee_last_name}` : ''}?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteEmployee}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

// Export the EmployeesList component 
export default EmployeesList;