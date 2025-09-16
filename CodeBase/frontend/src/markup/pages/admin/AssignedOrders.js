import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Card, Row, Col, Form, Alert } from "react-bootstrap";
import { useAuth } from "../../../Contexts/AuthContext";
import orderService from "../../../services/order.service";

const AssignedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;
  const mechanicId = employee ? employee.employee_id : null;

  // Status colors mapping
  const statusColors = {
    1: { label: "Received", variant: "secondary" },
    2: { label: "In Progress", variant: "warning" },
    3: { label: "Completed", variant: "success" },
  };

  // Fetch assigned orders for the mechanic
  useEffect(() => {
    if (token && mechanicId) {
      fetchAssignedOrders();
    }
  }, [token, mechanicId]);

  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrdersByEmployee(mechanicId);
      console.log("Fetched assigned orders:", data); // Debug: Check order data
      if (!data || data.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }
      setOrders(
        data.map((order) => ({
          ...order,
          received_by: order.employee_first_name && order.employee_last_name ? `${order.employee_first_name} ${order.employee_last_name}` : "Unknown",
          order_date: new Date(order.order_date).toLocaleDateString("en-GB"),
        })).reverse()
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching assigned orders:", error);
      setError("Failed to load assigned orders. Check server logs or ensure the backend is running.");
      setLoading(false);
    }
  };

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setError("");
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-access-token': token },
        body: JSON.stringify({ order_status: newStatus })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      await fetchAssignedOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status. Please try again.");
    }
  };

  // Export orders to CSV
  const handleExport = () => {
    const headers = ["Order ID, Customer, Vehicle, Order Date, Received By, Order Status, Services, Service Description"];
    const rows = filteredOrders.map(order => [
      order.order_id,
      `${order.customer_first_name} ${order.customer_last_name} (${order.customer_email})`,
      `${order.vehicle_make} ${order.vehicle_model} (${order.vehicle_tag})`,
      order.order_date,
      order.received_by,
      statusColors[order.order_status].label,
      order.services.join(", "),
      order.service_description || "N/A"
    ].join(", "));

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `assigned_orders_export_${new Date().toISOString().split('T')[0]}.csv`;
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

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#f4f7fa" }}>
        <h2 style={{ color: "#1a2b49" }}>Assigned Orders</h2>
        <p>Loading assigned orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", backgroundColor: "#f4f7fa" }}>
        <h2 style={{ color: "#1a2b49" }}>Assigned Orders</h2>
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <section style={{ padding: "20px", backgroundColor: "#f4f7fa" }}>
      <div className="container">
        <h2 style={{ color: "#1a2b49", marginBottom: "20px" }}>Assigned Orders</h2>

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
            Assigned Orders List
          </Card.Header>
          <Card.Body>
            {filteredOrders.length === 0 ? (
              <p className="text-center text-muted">No assigned orders found matching your criteria.</p>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ width: "60px" }}>Order ID</th>
                    <th style={{ minWidth: "200px" }}>Customer</th>
                    <th style={{ minWidth: "150px" }}>Vehicle</th>
                    <th style={{ width: "120px" }}>Order Date</th>
                    <th style={{ width: "150px" }}>Received By</th>
                    <th style={{ width: "120px" }}>Order Status</th>
                    <th style={{ width: "150px" }}>Change Status</th>
                    <th style={{ width: "150px" }}>Services</th>
                    <th style={{ minWidth: "200px" }}>Service Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    console.log(`Order ${order.order_id} status: ${order.order_status}`); // Debug: Log each order's status
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
                        <td>{order.received_by}</td>
                        <td><Badge bg={status.variant}>{status.label}</Badge></td>
                        <td>
                          <Form.Select
                            value={order.order_status}
                            onChange={(e) => handleStatusUpdate(order.order_id, parseInt(e.target.value))}
                            style={{ width: "120px" }}
                          >
                            <option value="1">Received</option>
                            <option value="2">In Progress</option>
                            <option value="3">Completed</option>
                          </Form.Select>
                        </td>
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

export default AssignedOrders;