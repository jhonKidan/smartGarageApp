import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Card, Row, Col, Form, Alert } from "react-bootstrap";
import { useAuth } from "../../../../Contexts/AuthContext";
import orderService from "../../../../services/order.service";

const OrderStatusRec = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;
  const isAuthorized = employee && (employee.employee_role === 3 || employee.employee_role === 1);

  // Status colors mapping
  const statusColors = {
    1: { label: "Received", variant: "secondary" },
    2: { label: "In Progress", variant: "warning" },
    3: { label: "Completed", variant: "success" },
  };

  // Fetch all orders with details
  useEffect(() => {
    if (token && isAuthorized) {
      fetchAllOrders();
    } else {
      setLoading(false); // Stop loading if not authorized
    }
  }, [token, isAuthorized]);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders(token);
      console.log("Fetched orders with status:", data); // Debug: Check all order data
      if (!data || data.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }
      setOrders(
        data.map((order) => ({
          ...order,
          order_date: new Date(order.order_date).toLocaleDateString("en-GB"),
          assigned_mechanic: order.employee_id && order.employee_first_name && order.employee_last_name
            ? `${order.employee_first_name} ${order.employee_last_name}`.trim()
            : "N/A",
        })).reverse()
      );
      console.log("Processed orders:", orders); // Debug: Check processed orders
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Check server logs or ensure the backend is running.");
      setLoading(false);
    }
  };

  // Export orders to CSV
  const handleExport = () => {
    const headers = ["Order ID,Customer,Vehicle,Order Date,Assigned Mechanic,Order Status,Services,Service Description"];
    const rows = filteredOrders.map(order => [
      order.order_id,
      `${order.customer_first_name} ${order.customer_last_name} (${order.customer_email})`,
      `${order.vehicle_make} ${order.vehicle_model} (${order.vehicle_tag})`,
      order.order_date,
      order.assigned_mechanic,
      statusColors[order.order_status].label,
      order.services.join(", "),
      order.service_description || "N/A"
    ].join(","));

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Filter and search orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicle_make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicle_model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicle_tag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.order_status === parseInt(statusFilter);

    return matchesSearch && matchesStatus;
  });

  if (!isAuthorized) {
    return (
      <div style={{ padding: "20px", backgroundColor: "#f4f7fa" }}>
        <h2 style={{ color: "#1a2b49" }}>Orders</h2>
        <Alert variant="danger">You are not authorized to access this page.</Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#f4f7fa" }}>
        <h2 style={{ color: "#1a2b49" }}>Orders</h2>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", backgroundColor: "#f4f7fa" }}>
        <h2 style={{ color: "#1a2b49" }}>Orders</h2>
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <section style={{ padding: "20px", backgroundColor: "#f4f7fa" }}>
      <div className="container">
        <h2 style={{ color: "#1a2b49", marginBottom: "20px" }}>Orders</h2>

        {/* Filters and Search */}
        <Card className="mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Search Orders</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search by customer, vehicle, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="1">Received</option>
                    <option value="2">In Progress</option>
                    <option value="3">Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={5} className="text-end">
                <Button variant="danger" className="me-2" href="/admin/add-orders">
                  Add New Order
                </Button>
                <Button variant="outline-secondary" onClick={handleExport}>
                  Export
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Orders Table */}
        <Card>
          <Card.Header style={{ backgroundColor: "#1a2b49", color: "white", display: "flex", alignItems: "center" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "white", borderRadius: "50%", marginRight: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc3545" }}>
              Orders
            </div>
            Orders List
          </Card.Header>
          <Card.Body>
            {filteredOrders.length === 0 ? (
              <p className="text-center text-muted">No orders found matching your criteria.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ width: "80px" }}>Order ID</th>
                    <th style={{ minWidth: "220px" }}>Customer</th>
                    <th style={{ minWidth: "180px" }}>Vehicle</th>
                    <th style={{ width: "140px" }}>Order Date</th>
                    <th style={{ width: "180px" }}>Assigned Mechanic</th>
                    <th style={{ width: "140px" }}>Order Status</th>
                    <th style={{ minWidth: "180px" }}>Services</th>
                    <th style={{ minWidth: "220px" }}>Service Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    console.log(`Order ${order.order_id} status: ${order.order_status}, assigned_mechanic: ${order.assigned_mechanic}`); // Debug
                    const status = statusColors[order.order_status];
                    const customerFullName = `${order.customer_first_name} ${order.customer_last_name}`;
                    const vehicleDisplay = `${order.vehicle_make} ${order.vehicle_model} (${order.vehicle_tag})`;

                    return (
                      <tr key={order.order_id}>
                        <td style={{ fontWeight: "bold" }}>{order.order_id}</td>
                        <td>
                          <div>{customerFullName}</div>
                          <small className="text-muted">{order.customer_email}</small>
                        </td>
                        <td>
                          <div>{vehicleDisplay}</div>
                          <small className="text-muted">{order.vehicle_tag}</small>
                        </td>
                        <td>{order.order_date}</td>
                        <td>{order.assigned_mechanic}</td>
                        <td><Badge bg={status.variant}>{status.label}</Badge></td>
                        <td>
                          <ul style={{ paddingLeft: "20px", margin: 0 }}>
                            {order.services.map((service, index) => (
                              <li key={index}>{service}</li>
                            ))}
                          </ul>
                        </td>
                        <td>{order.service_description || "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between align-items-center">
            <div>Showing {filteredOrders.length} of {orders.length} orders</div>
            <div>
              <Button variant="outline-secondary" size="sm" className="me-2" disabled>
                Previous
              </Button>
              <Button variant="outline-secondary" size="sm">
                Next
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </div>
    </section>
  );
};

export default OrderStatusRec;