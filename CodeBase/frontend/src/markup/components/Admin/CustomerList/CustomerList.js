import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import { useAuth } from "../../../../Contexts/AuthContext";
import { format } from 'date-fns';
import customerService from "../../../../services/customer.service";
import CustomerSearchBar from "./CustomerSearchBar"; 

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);

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
                <th>Edit/Delete</th>
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
                        ? format(new Date(customer.customer_added_date), 'MM-dd-yyyy | kk:mm')
                        : "-"}
                    </td>
                    <td>
                      <div className="edit-delete-icons">
                        edit | delete
                      </div>
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
    </section>
  );
};

export default CustomersList;


