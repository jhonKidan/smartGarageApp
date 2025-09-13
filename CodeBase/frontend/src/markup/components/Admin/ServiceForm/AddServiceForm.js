import React, { useState } from 'react';
import serviceService from '../../../../services/service.service';
import { useAuth } from "../../../../Contexts/AuthContext";

function AddServiceForm() {
  const [service_name, setServiceName] = useState('');
  const [service_description, setServiceDescription] = useState('');

  const [nameError, setNameError] = useState('');
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
    if (!service_name) {
      setNameError('Service name is required');
      valid = false;
    } else {
      setNameError('');
    }

    if (!valid) return;

    // ✅ Send form data
    const formData = {
      service_name,
      service_description,
    };

    const newService = serviceService.createService(formData, loggedInEmployeeToken);

    newService.then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setServerError(data.error);
        } else {
          setSuccess(true);
          setServerError('');
          setTimeout(() => {
            window.location.href = '/admin/services';
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
          <h2>Add a new service</h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">

                    <div className="form-group col-md-12">
                      {serverError && <div className="validation-error">{serverError}</div>}
                      {success && <div className="validation-success">Service added successfully!</div>}
                      <input
                        type="text"
                        name="service_name"
                        value={service_name}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="Service name"
                      />
                      {nameError && <div className="validation-error">{nameError}</div>}
                    </div>

                    <div className="form-group col-md-12">
                      <textarea
                        name="service_description"
                        value={service_description}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        placeholder="Service description"
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <button className="theme-btn btn-style-one" type="submit">
                        <span>Add Service</span>
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

export default AddServiceForm;
