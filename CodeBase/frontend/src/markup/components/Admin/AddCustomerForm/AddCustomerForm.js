import React, { useState } from 'react';
import customerService from '../../../../services/customer.service';
import { useAuth } from "../../../../Contexts/AuthContext";

function AddCustomerForm() {
  const [customer_email, setEmail] = useState('');
  const [customer_first_name, setFirstName] = useState('');
  const [customer_last_name, setLastName] = useState('');
  const [customer_phone_number, setPhoneNumber] = useState('');
  const [active_customer_status, setActiveStatus] = useState(1);

  // Errors and success
  const [emailError, setEmailError] = useState('');
  const [firstNameRequired, setFirstNameRequired] = useState('');
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  // Auth token
  let loggedInEmployeeToken = '';
  const { employee } = useAuth();
  if (employee && employee.employee_token) {
    loggedInEmployeeToken = employee.employee_token;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validation
    let valid = true;
    if (!customer_first_name) {
      setFirstNameRequired('First name is required');
      valid = false;
    } else {
      setFirstNameRequired('');
    }

    if (!customer_email) {
      setEmailError('Email is required');
      valid = false;
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(customer_email)) {
        setEmailError('Invalid email format');
        valid = false;
      } else {
        setEmailError('');
      }
    }

    if (!valid) return;

    // ✅ Send form data
    const formData = {
      customer_email,
      customer_first_name,
      customer_last_name,
      customer_phone_number,
      active_customer_status
    };

    const newCustomer = customerService.createCustomer(formData, loggedInEmployeeToken);

    newCustomer.then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setServerError(data.error);
        } else {
          setSuccess(true);
          setServerError('');
          setTimeout(() => {
            window.location.href = '/admin/customers';
          }, 2000);
        }
      })
      .catch((error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setServerError(resMessage);
      });
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Add a new customer</h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">

                    <div className="form-group col-md-12">
                      {serverError && <div className="validation-error">{serverError}</div>}
                      {success && <div className="validation-success">Customer added successfully!</div>}
                      <input
                        type="email"
                        name="customer_email"
                        value={customer_email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Customer email"
                      />
                      {emailError && <div className="validation-error">{emailError}</div>}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_first_name"
                        value={customer_first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Customer first name"
                      />
                      {firstNameRequired && <div className="validation-error">{firstNameRequired}</div>}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_last_name"
                        value={customer_last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Customer last name"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_phone_number"
                        value={customer_phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Customer phone (555-555-5555)"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <button className="theme-btn btn-style-one" type="submit">
                        <span>Add Customer</span>
                      </button>
                    </div>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddCustomerForm;
