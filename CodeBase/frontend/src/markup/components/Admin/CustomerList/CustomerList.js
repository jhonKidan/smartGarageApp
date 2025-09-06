// Import the necessary components 
import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import { useAuth } from "../../../../Contexts/AuthContext";
import { format } from 'date-fns'; 
import customerService from "../../../../services/customer.service";

// Create the CustomersList component 
const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);

  // Auth token
  const { employee } = useAuth();
  let token = null;
  if (employee) {
    token = employee.employee_token;
  }

  useEffect(() => {
    const allCustomers = customerService.getAllCustomers(token);
    allCustomers.then((res) => {
      if (!res.ok) {
        console.log(res.status);
        setApiError(true);
        if (res.status === 401) {
          setApiErrorMessage("Please login again");
        } else if (res.status === 403) {
          setApiErrorMessage("You are not authorized to view this page");
        } else {
          setApiErrorMessage("Please try again later");
        }
      }
      return res.json();
    }).then((data) => {
      if (data && data.data && data.data.length !== 0) {
        setCustomers(data.data);
      }
    }).catch((err) => {
      console.log(err);
    });
  }, [token]);

  return (
    <>
      {apiError ? (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>{apiErrorMessage}</h2>
            </div >
          </div>
        </section>
      ) : (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>Customers</h2>
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
                  <th>Edit/Delete</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td>{customer.active_customer_status ? "Yes" : "No"}</td>
                    <td>{customer.customer_first_name}</td>
                    <td>{customer.customer_last_name}</td>
                    <td>{customer.customer_email}</td>
                    <td>{customer.customer_phone_number}</td>
                    <td>{customer.customer_added_date ? format(new Date(customer.customer_added_date), 'MM-dd-yyyy | kk:mm') : "-"}</td>
                    <td>
                      <div className="edit-delete-icons">
                        edit | delete
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>
      )}
    </>
  );
};

export default CustomersList;
