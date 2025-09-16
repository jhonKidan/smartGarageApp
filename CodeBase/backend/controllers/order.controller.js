const orderService = require('../services/order.services');
const bcrypt = require('bcrypt');
const conn = require("../config/db.config");

// Controller: Create Order
async function createOrder(req, res, next) {
  try {
    const { customer_id, vehicle_id, selected_services, additional_request, total_price } = req.body;
    const employee_id = req.employee?.employee_id;

    console.log('Received Order Data:', { customer_id, vehicle_id, selected_services, additional_request, total_price, employee_id });

    if (!employee_id) {
      return res.status(401).json({
        status: "fail",
        message: "Authenticated employee ID is required",
      });
    }

    if (!customer_id || !vehicle_id || !selected_services || !Array.isArray(selected_services) || selected_services.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Customer ID, Vehicle ID, and at least one selected service are required",
      });
    }

    if (isNaN(customer_id) || isNaN(vehicle_id) || isNaN(total_price)) {
      return res.status(400).json({
        status: "fail",
        message: "Customer ID, Vehicle ID, and total price must be valid numbers",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const orderHash = await bcrypt.hash(`${customer_id}-${vehicle_id}-${Date.now()}`, salt);

    const orderData = {
      employee_id: parseInt(employee_id),
      customer_id: parseInt(customer_id),
      vehicle_id: parseInt(vehicle_id),
      order_hash: orderHash,
      selected_services: selected_services.map(id => parseInt(id)),
      additional_request: additional_request || '',
      total_price: parseInt(total_price) || 0,
      estimated_completion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    console.log('Processed Order Data:', orderData);

    const newOrder = await orderService.createOrder(orderData);
    if (!newOrder) {
      return res.status(400).json({
        status: "fail",
        message: "Failed to create order (database error)",
      });
    }

    res.status(201).json({
      status: "success",
      data: newOrder,
    });
  } catch (err) {
    console.error("Error in createOrder:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to create order",
    });
  }
}

// Controller: Get All Orders
async function getAllOrders(req, res, next) {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (err) {
    console.error("Error in getAllOrders:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch orders",
    });
  }
}

// Controller: Update Order Status
async function updateOrderStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    const { order_status } = req.body;
    const employee = req.employee;

    if (!orderId || isNaN(orderId) || !order_status || ![1, 2, 3].includes(parseInt(order_status))) {
      return res.status(400).json({
        status: "fail",
        message: "Valid orderId and order_status (1, 2, or 3) are required",
      });
    }

    // Restrict mechanics to updating only their assigned orders
    if (employee.employee_type === 'mechanic') {
      const [order] = await conn.query("SELECT employee_id FROM orders WHERE order_id = ?", [orderId]);
      if (!order || order.employee_id !== employee.employee_id) {
        return res.status(403).json({
          status: "fail",
          message: "Not authorized to update this order's status",
        });
      }
    }

    const updated = await orderService.updateOrderStatus(parseInt(orderId), parseInt(order_status));
    if (!updated) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found or update failed",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
    });
  } catch (err) {
    console.error("Error in updateOrderStatus:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to update order status",
    });
  }
}

// Controller: Assign Mechanic to Order
async function assignMechanic(req, res, next) {
  try {
    const { orderId } = req.params;
    const { employee_id } = req.body;

    if (!orderId || isNaN(orderId) || !employee_id || isNaN(employee_id)) {
      return res.status(400).json({
        status: "fail",
        message: "Valid orderId and employee_id are required",
      });
    }

    const updated = await orderService.assignMechanic(parseInt(orderId), parseInt(employee_id));
    if (!updated) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found or assignment failed",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Mechanic assigned successfully",
    });
  } catch (err) {
    console.error("Error in assignMechanic:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to assign mechanic",
    });
  }
}

// Controller: Get Orders by Employee
async function getOrdersByEmployee(req, res, next) {
  try {
    const { employeeId } = req.params;
    if (!employeeId || isNaN(employeeId)) {
      return res.status(400).json({
        status: "fail",
        message: "Valid employeeId is required",
      });
    }

    const orders = await orderService.getOrdersByEmployee(parseInt(employeeId));
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (err) {
    console.error("Error in getOrdersByEmployee:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch orders",
    });
  }
}

// Controller: Delete Order
async function deleteOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    if (!orderId || isNaN(orderId)) {
      return res.status(400).json({
        status: "fail",
        message: "Valid orderId is required",
      });
    }

    const deleted = await orderService.deleteOrder(parseInt(orderId));
    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found or deletion failed",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteOrder:", err.message, err.stack);
    res.status(500).json({
      status: "error",
      message: "Failed to delete order",
    });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  assignMechanic,
  getOrdersByEmployee,
  deleteOrder,
};