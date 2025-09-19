import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card, ListGroup } from 'react-bootstrap';
import { useAuth } from "../../../Contexts/AuthContext";
import customerService from "../../../services/customer.service";
import vehicleService from "../../../services/vehicle.service";
import CustomerSearchBar from "./CustomerList/CustomerSearchBar"; // Assuming this is available

const AddVehiclePage = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_year: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_type: '',
    vehicle_mileage: '',
    vehicle_tag: '',
    vehicle_serial: '',
    vehicle_color: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;

  // Handle customer search and selection
  const handleCustomerSearch = async (query) => {
    if (!query) return;
    try {
      setLoading(true);
      const res = await customerService.searchCustomers(token, query);
      if (!res.ok) throw res;
      const data = await res.json();
      if (data && data.data && data.data.length > 0) {
        // For simplicity, select the first matching customer. In production, show a list to choose.
        const customer = data.data[0];
        setSelectedCustomer(customer);
        setApiError(false);
        // Fetch vehicles for this customer
        await fetchVehicles(customer.customer_id);
      } else {
        setApiError(true);
        setApiErrorMessage("No customer found");
        setSelectedCustomer(null);
        setVehicles([]);
      }
    } catch (error) {
      setApiError(true);
      setApiErrorMessage("Error searching customer");
      setSelectedCustomer(null);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles for selected customer
  const fetchVehicles = async (customerId) => {
    try {
      const res = await vehicleService.getVehiclesByCustomer(token, customerId);
      if (!res.ok) throw res;
      const data = await res.json();
      if (data && data.data) {
        setVehicles(data.data);
      } else {
        setVehicles([]);
      }
    } catch (error) {
      setVehicles([]);
      console.error("Error fetching vehicles:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle add vehicle form submit
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setAlert({ show: true, message: 'Please select a customer first', variant: 'danger' });
      return;
    }
    try {
      setLoading(true);
      const res = await vehicleService.addVehicle(token, selectedCustomer.customer_id, formData);
      if (!res.ok) throw res;
      const data = await res.json();
      if (data && data.status === 'success') {
        // Refresh vehicles list
        await fetchVehicles(selectedCustomer.customer_id);
        // Reset form
        setFormData({
          vehicle_year: '',
          vehicle_make: '',
          vehicle_model: '',
          vehicle_type: '',
          vehicle_mileage: '',
          vehicle_tag: '',
          vehicle_serial: '',
          vehicle_color: ''
        });
        setAlert({ show: true, message: 'Vehicle added successfully!', variant: 'success' });
      } else {
        throw new Error('Failed to add vehicle');
      }
    } catch (error) {
      setAlert({ show: true, message: 'Error adding vehicle', variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // Hide alert after 5 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => setAlert({ ...alert, show: false }), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <section className="add-vehicle-section" style={{ padding: '20px', backgroundColor: '#f4f7fa' }}>
      <div className="container">
        <h2 style={{ color: '#1a2b49', marginBottom: '20px' }}>Add Vehicle</h2>

        {/* Customer Search */}
        <Card className="mb-4">
          <Card.Body>
            <h5>Search Customer</h5>
            <CustomerSearchBar onSearch={handleCustomerSearch} placeholder="Search by first name, last name, or phone" />
            {loading && <p>Loading...</p>}
            {apiError && <Alert variant="danger">{apiErrorMessage}</Alert>}
          </Card.Body>
        </Card>

        {/* Customer Info */}
        {selectedCustomer && (
          <Card className="mb-4">
            <Card.Header style={{ backgroundColor: '#1a2b49', color: 'white', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Info</div>
              Customer: {selectedCustomer.customer_first_name} {selectedCustomer.customer_last_name}
            </Card.Header>
            <Card.Body>
              <p>Email: {selectedCustomer.customer_email}</p>
              <p>Phone Number: {selectedCustomer.customer_phone_number}</p>
              <p>Active Customer: {selectedCustomer.active_customer_status ? 'Yes' : 'No'}</p>
              {/* <a href="#" style={{ color: '#dc3545' }}>Edit customer info</a> */}
            </Card.Body>
          </Card>
        )}

        {/* Vehicles List */}
        {selectedCustomer && (
          <Card className="mb-4">
            <Card.Header style={{ backgroundColor: '#1a2b49', color: 'white', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cars</div>
              Vehicles of {selectedCustomer.customer_first_name} {selectedCustomer.customer_last_name}
            </Card.Header>
            <Card.Body>
              {vehicles.length === 0 ? (
                <p>No vehicle found</p>
              ) : (
                <ListGroup>
                  {vehicles.map((vehicle) => (
                    <ListGroup.Item key={vehicle.vehicle_id}>
                      <strong>{vehicle.vehicle_year} {vehicle.vehicle_make} {vehicle.vehicle_model}</strong><br />
                      Type: {vehicle.vehicle_type} | Color: {vehicle.vehicle_color} | Mileage: {vehicle.vehicle_mileage} miles<br />
                      Tag: {vehicle.vehicle_tag} | Serial: {vehicle.vehicle_serial}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Orders Section - Placeholder */}
        {selectedCustomer && (
          <Card className="mb-4">
            <Card.Header style={{ backgroundColor: '#1a2b49', color: 'white', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Orders</div>
              Orders of {selectedCustomer.customer_first_name} {selectedCustomer.customer_last_name}
            </Card.Header>
            <Card.Body>
              <p>Orders will be displayed here</p>
            </Card.Body>
          </Card>
        )}

        {/* Add Vehicle Form */}
        {selectedCustomer ? (
          <Card>
            <Card.Header style={{ color: '#fff' }}>Add a new vehicle</Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddVehicle}>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Year</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="vehicle_year" 
                    value={formData.vehicle_year} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Enter year "
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Make</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="vehicle_make" 
                    value={formData.vehicle_make} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Enter make (e.g., Toyota, Ford,Honda)"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Model</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="vehicle_model" 
                    value={formData.vehicle_model} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Enter model (e.g., Corolla,Camry,Mustang )"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Type</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="vehicle_type" 
                    value={formData.vehicle_type} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Enter vehicle type (e.g., Sedan, SUV, Van)"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Mileage</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="vehicle_mileage" 
                    value={formData.vehicle_mileage} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Enter mileage (e.g., 50000)"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Tag</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="vehicle_tag" 
                    value={formData.vehicle_tag} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Enter license plate (e.g., ABC1234)"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Serial</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="vehicle_serial" 
                    value={formData.vehicle_serial} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Enter VIN (e.g., 1HGCM82633A123456)"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Color</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="vehicle_color" 
                    value={formData.vehicle_color} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Enter color (e.g., Blue, Red)"
                  />
                </Form.Group>
                <Button variant="danger" type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'ADD VEHICLE'}
                </Button>
              </Form>
              {alert.show && <Alert variant={alert.variant} className="mt-3">{alert.message}</Alert>}
            </Card.Body>
          </Card>
        ) : (
          <Card>
            <Card.Body>
              <p>Please search and select a customer to add a vehicle.</p>
            </Card.Body>
          </Card>
        )}
      </div>
    </section>
  );
};

export default AddVehiclePage;