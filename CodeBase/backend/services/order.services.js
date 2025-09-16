const conn = require("../config/db.config");
const employeeService = require('./employee.service'); // Assume employee service exists

// Create a new order
async function createOrder(orderData) {
  let createdOrder = null;
  try {
    console.log('Service: Starting order creation with data:', orderData);

    // 1. Insert into orders table
    const query1 = `
      INSERT INTO orders (employee_id, customer_id, vehicle_id, order_date, active_order, order_hash) 
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, 1, ?)
    `;
    const rows1 = await conn.query(query1, [
      orderData.employee_id,
      orderData.customer_id,
      orderData.vehicle_id,
      orderData.order_hash
    ]);

    if (rows1.affectedRows !== 1) {
      console.error('Service: Failed to insert into orders');
      return false;
    }

    const order_id = rows1.insertId;
    console.log('Service: Order inserted with ID:', order_id);

    // 2. Insert into order_info table
    const query2 = `
      INSERT INTO order_info (
        order_id, order_total_price, estimated_completion_date, completion_date, 
        additional_request, notes_for_internal_use, notes_for_customer, additional_requests_completed
      ) VALUES (?, ?, ?, NULL, ?, '', '', 0)
    `;
    const rows2 = await conn.query(query2, [
      order_id,
      orderData.total_price,
      orderData.estimated_completion_date,
      orderData.additional_request
    ]);

    if (rows2.affectedRows !== 1) {
      console.error('Service: Failed to insert into order_info');
      return false;
    }

    console.log('Service: Order info inserted');

    // 3. Insert into order_services for each selected service
    const query3 = `
      INSERT INTO order_services (order_id, service_id, service_completed) 
      VALUES (?, ?, 0)
    `;
    for (const service_id of orderData.selected_services) {
      const rows3 = await conn.query(query3, [order_id, service_id]);
      if (rows3.affectedRows !== 1) {
        console.error('Service: Failed to insert service:', service_id);
        return false;
      }
    }

    console.log('Service: Order services inserted');

    // 4. Insert into order_status (default status 1 - pending)
    const query4 = `INSERT INTO order_status (order_id, order_status) VALUES (?, 1)`;
    const rows4 = await conn.query(query4, [order_id]);

    if (rows4.affectedRows !== 1) {
      console.error('Service: Failed to insert order status');
      return false;
    }

    console.log('Service: Order status inserted');

    // Return created order details
    createdOrder = {
      order_id,
      order_hash: orderData.order_hash,
      customer_id: orderData.customer_id,
      vehicle_id: orderData.vehicle_id,
      total_price: orderData.total_price,
      services: orderData.selected_services,
      additional_request: orderData.additional_request,
      estimated_completion_date: orderData.estimated_completion_date
    };

    console.log('Service: Order created successfully:', createdOrder);
  } catch (err) {
    console.error("Service Error creating order:", err);
    return false;
  }

  return createdOrder;
}

// Get all orders with customer, vehicle, employee, and service details
async function getAllOrders(token) {
  const query = `
    SELECT 
      o.order_id,
      o.order_date,
      o.employee_id,
      o.order_hash,
      os.order_status,
      ci.customer_first_name,
      ci.customer_last_name,
      cid.customer_email,
      cvi.vehicle_make,
      cvi.vehicle_model,
      cvi.vehicle_tag,
      ei.employee_first_name,
      ei.employee_last_name,
      cs.service_name,
      oi.additional_request AS service_description
    FROM orders o
    INNER JOIN order_status os ON o.order_id = os.order_id
    INNER JOIN customer_info ci ON o.customer_id = ci.customer_id
    INNER JOIN customer_identifier cid ON ci.customer_id = cid.customer_id
    INNER JOIN customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
    LEFT JOIN employee e ON o.employee_id = e.employee_id
    LEFT JOIN employee_info ei ON e.employee_id = ei.employee_id
    INNER JOIN order_services osv ON o.order_id = osv.order_id
    INNER JOIN common_services cs ON osv.service_id = cs.service_id
    INNER JOIN order_info oi ON o.order_id = oi.order_id
    ORDER BY o.order_id DESC
  `;
  const rows = await conn.query(query);
  
  // Group services by order_id to handle multiple services
  const ordersMap = new Map();
  rows.forEach(row => {
    if (!ordersMap.has(row.order_id)) {
      ordersMap.set(row.order_id, {
        order_id: row.order_id,
        order_date: row.order_date,
        employee_id: row.employee_id,
        order_hash: row.order_hash,
        order_status: row.order_status,
        customer_first_name: row.customer_first_name,
        customer_last_name: row.customer_last_name,
        customer_email: row.customer_email,
        vehicle_make: row.vehicle_make,
        vehicle_model: row.vehicle_model,
        vehicle_tag: row.vehicle_tag,
        employee_first_name: row.employee_first_name,
        employee_last_name: row.employee_last_name,
        services: [],
        service_description: row.service_description
      });
    }
    ordersMap.get(row.order_id).services.push(row.service_name);
  });

  return Array.from(ordersMap.values());
}

// Update order status
async function updateOrderStatus(orderId, orderStatus) {
  try {
    const query = `
      UPDATE order_status 
      SET order_status = ?
      WHERE order_id = ?
    `;
    const [result] = await conn.query(query, [orderStatus, orderId]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Service Error updating order status:", err);
    throw err;
  }
}

// Assign mechanic to order
async function assignMechanic(orderId, employeeId) {
  try {
    // Validate that employeeId is a mechanic
    const employee = await employeeService.getEmployeeById(employeeId);
    if (!employee || employee.company_role_id !== 1 || employee.employee_type !== "mechanic") {
      throw new Error("Invalid mechanic ID");
    }

    const query = `
      UPDATE orders 
      SET employee_id = ?
      WHERE order_id = ?
    `;
    const [result] = await conn.query(query, [employeeId, orderId]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Service Error assigning mechanic:", err);
    throw err;
  }
}

// Get orders by employee
async function getOrdersByEmployee(employeeId) {
  const query = `
    SELECT 
      o.order_id,
      o.order_date,
      o.employee_id,
      o.order_hash,
      os.order_status,
      ci.customer_first_name,
      ci.customer_last_name,
      cid.customer_email,
      cvi.vehicle_make,
      cvi.vehicle_model,
      cvi.vehicle_tag,
      ei.employee_first_name,
      ei.employee_last_name,
      cs.service_name,
      oi.additional_request AS service_description
    FROM orders o
    INNER JOIN order_status os ON o.order_id = os.order_id
    INNER JOIN customer_info ci ON o.customer_id = ci.customer_id
    INNER JOIN customer_identifier cid ON ci.customer_id = cid.customer_id
    INNER JOIN customer_vehicle_info cvi ON o.vehicle_id = cvi.vehicle_id
    LEFT JOIN employee e ON o.employee_id = e.employee_id
    LEFT JOIN employee_info ei ON e.employee_id = ei.employee_id
    INNER JOIN order_services osv ON o.order_id = osv.order_id
    INNER JOIN common_services cs ON osv.service_id = cs.service_id
    INNER JOIN order_info oi ON o.order_id = oi.order_id
    WHERE o.employee_id = ? AND o.active_order = 1
    ORDER BY o.order_id DESC
  `;
  const rows = await conn.query(query, [employeeId]);
  
  const ordersMap = new Map();
  rows.forEach(row => {
    if (!ordersMap.has(row.order_id)) {
      ordersMap.set(row.order_id, {
        order_id: row.order_id,
        order_date: row.order_date,
        employee_id: row.employee_id,
        order_hash: row.order_hash,
        order_status: row.order_status,
        customer_first_name: row.customer_first_name,
        customer_last_name: row.customer_last_name,
        customer_email: row.customer_email,
        vehicle_make: row.vehicle_make,
        vehicle_model: row.vehicle_model,
        vehicle_tag: row.vehicle_tag,
        employee_first_name: row.employee_first_name,
        employee_last_name: row.employee_last_name,
        services: [],
        service_description: row.service_description
      });
    }
    ordersMap.get(row.order_id).services.push(row.service_name);
  });

  return Array.from(ordersMap.values());
}

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  assignMechanic,
  getOrdersByEmployee
};