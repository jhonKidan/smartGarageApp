import React, { useState } from 'react';
import { Table, Button, Badge, Card, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import '../../assets/styles/custom.css'; // Adjust path to match your project

function OrderStatus() {
  const [searchCriteria, setSearchCriteria] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Status colors mapping (same as OrderStatusRec.jsx)
  const statusColors = {
    1: { label: 'Received', variant: 'secondary' },
    2: { label: 'In Progress', variant: 'warning' },
    3: { label: 'Completed', variant: 'success' },
  };

  // Input validation functions
  const validateName = (value) => {
    return value.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 255); // Match backend sanitization, limit length
  };

  const validatePhoneNumber = (value) => {
    return value.replace(/[^0-9]/g, '').slice(0, 15); // Allow only digits, max 15 for safety
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    if (name === 'first_name' || name === 'last_name') {
      sanitizedValue = validateName(value);
    } else if (name === 'phone_number') {
      sanitizedValue = validatePhoneNumber(value);
    }

    setSearchCriteria((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setOrders([]);
    setLoading(true);

    // Validate all fields are filled
    if (!searchCriteria.first_name || !searchCriteria.last_name || !searchCriteria.phone_number) {
      setError('Please enter all search criteria: first name, last name, and phone number.');
      setLoading(false);
      return;
    }

    // Validate phone number length
    if (searchCriteria.phone_number.length < 2) {
      setError('Phone number must be at least 2 digits.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/public-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchCriteria),
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setOrders(
          data.data.map((order) => ({
            ...order,
            order_date: new Date(order.order_date).toLocaleDateString('en-GB'),
            assigned_mechanic:
              order.employee_first_name && order.employee_last_name
                ? `${order.employee_first_name} ${order.employee_last_name}`.trim()
                : 'N/A',
          }))
        );
        if (data.data.length === 0) {
          setError('No orders found matching the provided first name, last name, and phone number.');
        }
      } else {
        setError(data.message || 'Failed to fetch order status. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while fetching order status. Please try again later.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '20px', backgroundColor: '#f4f7fa' }}>
      <div className="auto-container">
        <h2 style={{ color: '#1a2b49', marginBottom: '20px' }}>Check Your Order Status</h2>
        <p>Enter your exact first name, last name, and phone number to view your order progress.</p>

        {/* Search Form */}
        <Card className="mb-4">
          <Card.Body>
            <Form onSubmit={handleSearch}>
              <Row className="align-items-end">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={searchCriteria.first_name}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      maxLength={255}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={searchCriteria.last_name}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      maxLength={255}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone_number"
                      value={searchCriteria.phone_number}
                      onChange={handleInputChange}
                      placeholder="Enter phone number (e.g., 5555555555)"
                      maxLength={15}
                    />
                    
                  </Form.Group>
                </Col>
                <Col md={3} className="text-end">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Searching...
                      </>
                    ) : (
                      'Search Orders'
                    )}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Error Message */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Orders Table */}
        {orders.length > 0 && (
          <Card>
            <Card.Header
              style={{
                backgroundColor: '#1a2b49',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  marginRight: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc3545',
                }}
              >
                Orders
              </div>
              Your Orders
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ width: '80px' }}>Order ID</th>
                    <th style={{ minWidth: '220px' }}>Customer</th>
                    <th style={{ width: '140px' }}>Phone Number</th>
                    <th style={{ minWidth: '180px' }}>Vehicle</th>
                    <th style={{ width: '140px' }}>Order Date</th>
                    <th style={{ width: '180px' }}>Assigned Mechanic</th>
                    <th style={{ width: '140px' }}>Order Status</th>
                    <th style={{ minWidth: '180px' }}>Services</th>
                    <th style={{ minWidth: '220px' }}>Service Description</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const status = statusColors[order.order_status] || { label: 'Unknown', variant: 'secondary' };
                    const customerFullName = `${order.first_name} ${order.last_name}`;
                    const vehicleDisplay = `${order.vehicle_make} ${order.vehicle_model} (${order.vehicle_tag})`;

                    return (
                      <tr key={order.order_id}>
                        <td style={{ fontWeight: 'bold' }}>{order.order_id}</td>
                        <td>
                          <div>{customerFullName}</div>
                          <small className="text-muted">{order.customer_email}</small>
                        </td>
                        <td>{order.phone_number || 'N/A'}</td>
                        <td>
                          <div>{vehicleDisplay}</div>
                          <small className="text-muted">{order.vehicle_tag}</small>
                        </td>
                        <td>{order.order_date}</td>
                        <td>{order.assigned_mechanic}</td>
                        <td>
                          <Badge bg={status.variant}>{status.label}</Badge>
                        </td>
                        <td>
                          <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {order.services.map((service, index) => (
                              <li key={index}>{service}</li>
                            ))}
                          </ul>
                        </td>
                        <td>{order.service_description || 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between align-items-center">
              <div>Showing {orders.length} orders</div>
            </Card.Footer>
          </Card>
        )}
      </div>
    </section>
  );
}

export default OrderStatus;