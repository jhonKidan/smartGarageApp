import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card, Table, ListGroup, Row, Col } from 'react-bootstrap';
import { useAuth } from "../../../Contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import '../../../../src/assets/styles/custom.css';
import customerService from "../../../services/customer.service";
import vehicleService from "../../../services/vehicle.service";
import orderService from "../../../services/order.service";
import serviceService from "../../../services/service.service";

const CustomerSearchBar = ({ onSearch, placeholder = "Search customers..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex">
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button variant="outline-secondary" type="submit" className="ms-2">
        Search
      </Button>
    </Form>
  );
};

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [additionalRequest, setAdditionalRequest] = useState('');
  const [additionalPrice, setAdditionalPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    vehicle_year: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_type: '',
    vehicle_mileage: '',
    vehicle_tag: '',
    vehicle_serial: '',
    vehicle_color: ''
  });

  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;

  // Fetch services on load
  useEffect(() => {
    if (token) {
      serviceService.getAllServices(token)
        .then((res) => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then((data) => {
          if (data && data.data) setServices(data.data);
        })
        .catch((error) => {
          console.error('Error loading services:', error);
          setAlert({ show: true, message: 'Error loading services', variant: 'danger' });
        });
    }
  }, [token]);

  // Handle customer search
  const handleCustomerSearch = async (query) => {
    if (!query) return;
    try {
      setLoading(true);
      const res = await customerService.searchCustomers(token, query);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Search failed');
      }
      const data = await res.json();
      if (data && data.data && data.data.length > 0) {
        setSearchResults(data.data);
        setSelectedCustomer(null);
        setSelectedVehicle(null);
        setVehicles([]);
      } else {
        setSearchResults([]);
        setAlert({ show: true, message: 'No customers found for this query', variant: 'warning' });
      }
    } catch (error) {
      console.error('Search Error:', error);
      setSearchResults([]);
      setAlert({ show: true, message: `Error searching customers: ${error.message}`, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles for customer
  const fetchVehicles = async (customerId) => {
    try {
      const res = await vehicleService.getVehiclesByCustomer(token, customerId);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch vehicles');
      }
      const data = await res.json();
      setVehicles(data.data || []);
    } catch (error) {
      console.error('Vehicles Error:', error);
      setVehicles([]);
      setAlert({ show: true, message: `Error fetching vehicles: ${error.message}`, variant: 'danger' });
    }
  };

  // Select customer from search results
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setSearchResults([]);
    fetchVehicles(customer.customer_id);
  };

  // Select vehicle
  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  // Handle service checkbox change
  const handleServiceChange = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
  };

  // Calculate total price
  useEffect(() => {
    const price = parseFloat(additionalPrice) || 0;
    setTotalPrice(price);
  }, [additionalPrice, selectedServices]);

  // Handle add vehicle
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!vehicleData.vehicle_year || !vehicleData.vehicle_make || !vehicleData.vehicle_model ||
        !vehicleData.vehicle_type || !vehicleData.vehicle_mileage || !vehicleData.vehicle_tag ||
        !vehicleData.vehicle_serial || !vehicleData.vehicle_color) {
      setAlert({ show: true, message: 'All vehicle fields are required', variant: 'danger' });
      return;
    }
    try {
      setLoading(true);
      const res = await vehicleService.addVehicle(token, selectedCustomer.customer_id, vehicleData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add vehicle');
      }
      const data = await res.json();
      if (data && data.status === 'success') {
        fetchVehicles(selectedCustomer.customer_id);
        setShowAddVehicle(false);
        setVehicleData({
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
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Add Vehicle Error:', error);
      setAlert({ show: true, message: `Error adding vehicle: ${error.message}`, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit to create order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedVehicle || selectedServices.length === 0) {
      setAlert({ show: true, message: 'Please select customer, vehicle, and at least one service', variant: 'danger' });
      return;
    }
    try {
      setLoading(true);
      const orderData = {
        customer_id: selectedCustomer.customer_id,
        vehicle_id: selectedVehicle.vehicle_id,
        selected_services: selectedServices,
        additional_request: additionalRequest,
        total_price: totalPrice
      };
      console.log('Submitting Order Data:', orderData);
      const res = await orderService.createOrder(token, orderData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP ${res.status}: Failed to create order`);
      }
      const data = await res.json();
      if (data && data.status === 'success') {
        setSelectedCustomer(null);
        setSelectedVehicle(null);
        setVehicles([]);
        setSelectedServices([]);
        setAdditionalRequest('');
        setAdditionalPrice('');
        setTotalPrice(0);
        setAlert({ 
          show: true, 
          message: 'Order created successfully! You can create another order or return to the orders list.', 
          variant: 'success' 
        });
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Submit Order Error:', error);
      setAlert({ show: true, message: `Error creating order: ${error.message}`, variant: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  // Handle alert dismissal
  const handleDismissAlert = () => {
    setAlert({ ...alert, show: false });
  };

  return (
    <section className="create-order-section" style={{ padding: '20px', backgroundColor: '#f4f7fa' }}>
      <div className="container">
        <h2 style={{ color: '#1a2b49', marginBottom: '20px' }}>Create a new order</h2>

        {/* Alert for success/error messages */}
        {alert.show && (
          <Alert 
            variant={alert.variant} 
            className="mt-3" 
            dismissible 
            onClose={handleDismissAlert}
            style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            {alert.message}
            {alert.variant === 'success' && (
              <div className="mt-2">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => navigate('/admin/orders')}
                  className="me-2"
                >
                  View Orders List
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={handleDismissAlert}
                >
                  Create Another Order
                </Button>
              </div>
            )}
          </Alert>
        )}

        {/* Step 1: Search Customer */}
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={8}>
                <CustomerSearchBar 
                  onSearch={handleCustomerSearch} 
                  placeholder="Search for a customer using first name, last name, email address or phone number" 
                />
              </Col>
              <Col md={4}>
                <Button 
                  variant="danger" 
                  onClick={() => navigate("/admin/add-customer")}
                >
                  ADD NEW CUSTOMER
                </Button>
              </Col>
            </Row>
            {loading && <p>Loading...</p>}
            {searchResults.length > 0 && (
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((customer) => (
                    <tr key={customer.customer_id}>
                      <td>{customer.customer_first_name}</td>
                      <td>{customer.customer_last_name}</td>
                      <td>{customer.customer_email}</td>
                      <td>{customer.customer_phone_number}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Step 2: Customer Info */}
        {selectedCustomer && (
          <Card className="mb-4">
            <Card.Header style={{ backgroundColor: '#282B2E', color: 'white', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Info</div>
              Customer: {selectedCustomer.customer_first_name} {selectedCustomer.customer_last_name}
              <Button variant="link" size="sm" onClick={() => setSelectedCustomer(null)} style={{ marginLeft: 'auto', color: 'white' }}>×</Button>
            </Card.Header>
            <Card.Body>
              <p>Email: {selectedCustomer.customer_email}</p>
              <p>Phone Number: {selectedCustomer.customer_phone_number}</p>
              <p>Active Customer: {selectedCustomer.active_customer_status ? 'Yes' : 'No'}</p>
              <a href="#" style={{ color: '#dc3545' }}>Edit customer info</a>
            </Card.Body>
          </Card>
        )}

        {/* Step 3: Select or Add Vehicle */}
        {selectedCustomer && (
          <Card className="mb-4">
            <Card.Header style={{ backgroundColor: '#dc3545', color: 'white', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cars</div>
              Vehicles of {selectedCustomer.customer_first_name} {selectedCustomer.customer_last_name}
            </Card.Header>
            <Card.Body>
              {vehicles.length === 0 && !selectedVehicle && (
                <div>
                  <p>No vehicles found. <Button variant="primary" onClick={() => setShowAddVehicle(true)}>Add Vehicle</Button></p>
                  {showAddVehicle && (
                    <Form onSubmit={handleAddVehicle}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label>Year</Form.Label>
                            <Form.Control
                              type="number"
                              name="vehicle_year"
                              value={vehicleData.vehicle_year}
                              onChange={(e) => setVehicleData({ ...vehicleData, vehicle_year: e.target.value })}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label>Make</Form.Label>
                            <Form.Control
                              type="text"
                              name="vehicle_make"
                              value={vehicleData.vehicle_make}
                              onChange={(e) => setVehicleData({ ...vehicleData, vehicle_make: e.target.value })}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label>Model</Form.Label>
                            <Form.Control
                              type="text"
                              name="vehicle_model"
                              value={vehicleData.vehicle_model}
                              onChange={(e) => setVehicleData({ ...vehicleData, vehicle_model: e.target.value })}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                              name="vehicle_type"
                              value={vehicleData.vehicle_type}
                              onChange={(e) => setVehicleData({ ...vehicleData, vehicle_type: e.target.value })}
                              required
                            >
                              <option value="">Select type</option>
                              <option value="Sedan">Sedan</option>
                              <option value="SUV">SUV</option>
                              <option value="Truck">Truck</option>
                              <option value="Hatchback">Hatchback</option>
                              <option value="Coupe">Coupe</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label>Mileage</Form.Label>
                            <Form.Control
                              type="number"
                              name="vehicle_mileage"
                              value={vehicleData.vehicle_mileage}
                              onChange={(e) => setVehicleData({ ...vehicleData, vehicle_mileage: e.target.value })}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label>Tag</Form.Label>
                            <Form.Control
                              type="text"
                              name="vehicle_tag"
                              value={vehicleData.vehicle_tag}
                              onChange={(e) => setVehicleData({ ...vehicleData, vehicle_tag: e.target.value })}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label>Serial</Form.Label>
                            <Form.Control
                              type="text"
                              name="vehicle_serial"
                              value={vehicleData.vehicle_serial}
                              onChange={(e) => setVehicleData({ ...vehicleData, vehicle_serial: e.target.value })}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-2">
                            <Form.Label>Color</Form.Label>
                            <Form.Control
                              type="text"
                              name="vehicle_color"
                              value={vehicleData.vehicle_color}
                              onChange={(e) => setVehicleData({ ...vehicleData, vehicle_color: e.target.value })}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button variant="danger" type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Vehicle'}
                      </Button>
                      <Button variant="secondary" className="ms-2" onClick={() => setShowAddVehicle(false)}>
                        Cancel
                      </Button>
                    </Form>
                  )}
                </div>
              )}
              {vehicles.length > 0 && !selectedVehicle && (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Tag</th>
                      <th>Serial</th>
                      <th>Color</th>
                      <th>Mileage</th>
                      <th>Choose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.vehicle_id}>
                        <td>{vehicle.vehicle_year}</td>
                        <td>{vehicle.vehicle_make}</td>
                        <td>{vehicle.vehicle_model}</td>
                        <td>{vehicle.vehicle_tag}</td>
                        <td>{vehicle.vehicle_serial}</td>
                        <td>{vehicle.vehicle_color}</td>
                        <td>{vehicle.vehicle_mileage}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => handleSelectVehicle(vehicle)}
                          >
                            Choose
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              {selectedVehicle && (
                <div>
                  <p>Selected Vehicle: {selectedVehicle.vehicle_make} {selectedVehicle.vehicle_model} ({selectedVehicle.vehicle_tag})</p>
                  <Button variant="link" size="sm" onClick={() => setSelectedVehicle(null)}>Change Vehicle</Button>
                </div>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Step 4: Choose Services and Add Order */}
        {(selectedCustomer && selectedVehicle) && (
          <Form onSubmit={handleSubmitOrder}>
            <Card className="mb-4">
              <Card.Header style={{ backgroundColor: '#1a2b49', color: 'white' }}>Choose Services</Card.Header>
              <Card.Body>
                <ListGroup>
                  {services.map((service) => (
                    <ListGroup.Item key={service.service_id}>
                      <Form.Check
                        type="checkbox"
                        id={`service-${service.service_id}`}
                        label={
                          <>
                            <strong>{service.service_name}</strong>
                            <br />
                            {service.service_description || 'No description'}
                          </>
                        }
                        checked={selectedServices.includes(service.service_id)}
                        onChange={() => handleServiceChange(service.service_id)}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header style={{ backgroundColor: '#1a2b49', color: 'white' }}>Additional Requests</Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Service Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={additionalRequest}
                    onChange={(e) => setAdditionalRequest(e.target.value)}
                    placeholder="Enter additional service description..."
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={additionalPrice}
                    onChange={(e) => setAdditionalPrice(e.target.value)}
                    placeholder="Enter price for additional request"
                  />
                </Form.Group>
                <p><strong>Total Price: ${totalPrice}</strong></p>
              </Card.Body>
            </Card>

            <Button 
              variant="danger" 
              type="submit" 
              disabled={loading || selectedServices.length === 0}
            >
              {loading ? 'Submitting...' : 'SUBMIT ORDER'}
            </Button>
          </Form>
        )}
      </div>
    </section>
  );
};

export default CreateOrderPage;