const orderService = require('../services/order.services');
const bcrypt = require('bcrypt');

// Controller: Create Order
async function createOrder(req, res, next) {
  try {
    const { customer_id, vehicle_id, selected_services, additional_request, total_price } = req.body;
    const employee_id = req.employee?.employee_id || 1; // Fallback to 1 for testing; replace with token extraction

    console.log('Received Order Data:', { customer_id, vehicle_id, selected_services, additional_request, total_price, employee_id });

    if (!customer_id || !vehicle_id || !selected_services || !Array.isArray(selected_services) || selected_services.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Customer ID, Vehicle ID, and at least one selected service are required",
      });
    }

    if (!employee_id) {
      return res.status(400).json({
        status: "error",
        message: "Employee ID is required",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const orderHash = await bcrypt.hash(`${customer_id}-${vehicle_id}-${Date.now()}`, salt);

    const orderData = {
      employee_id,
      customer_id: parseInt(customer_id),
      vehicle_id: parseInt(vehicle_id),
      order_hash: orderHash,
      selected_services: selected_services.map(id => parseInt(id)),
      additional_request: additional_request || '',
      total_price: parseInt(total_price) || 0,
      estimated_completion_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    console.log('Processed Order Data:', orderData);

    const newOrder = await orderService.createOrder(orderData);

    if (!newOrder) {
      return res.status(400).json({
        status: "error",
        message: "Failed to create order (database error)",
      });
    }

    res.status(201).json({
      status: "success",
      data: newOrder,
    });
  } catch (err) {
    console.error("Error in createOrder:", err);
    res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong!",
    });
  }
}

// Controller: Get All Orders
async function getAllOrders(req, res, next) {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      status: "success",
      data: orders
    });
  } catch (err) {
    console.error("Error in getAllOrders:", err);
    res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong!"
    });
  }
}

// Controller: Update Order Status
async function updateOrderStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    const { order_status } = req.body;

    if (!orderId || !order_status || ![1, 2, 3].includes(parseInt(order_status))) {
      return res.status(400).json({
        status: "error",
        message: "Valid orderId and order_status (1, 2, or 3) are required",
      });
    }

    const updated = await orderService.updateOrderStatus(parseInt(orderId), parseInt(order_status));
    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Order not found or update failed",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
    });
  } catch (err) {
    console.error("Error in updateOrderStatus:", err);
    res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong!"
    });
  }
}

// Controller: Assign Mechanic to Order
async function assignMechanic(req, res, next) {
  try {
    const { orderId } = req.params;
    const { employee_id } = req.body;

    if (!orderId || !employee_id) {
      return res.status(400).json({
        status: "error",
        message: "Valid orderId and employee_id are required",
      });
    }

    const updated = await orderService.assignMechanic(parseInt(orderId), parseInt(employee_id));
    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "Order not found or assignment failed",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Mechanic assigned successfully",
    });
  } catch (err) {
    console.error("Error in assignMechanic:", err);
    res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong!"
    });
  }
}

// Controller: Get Orders by Employee
async function getOrdersByEmployee(req, res, next) {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      return res.status(400).json({
        status: "error",
        message: "Valid employeeId is required",
      });
    }

    const orders = await orderService.getOrdersByEmployee(parseInt(employeeId));
    res.status(200).json({
      status: "success",
      data: orders
    });
  } catch (err) {
    console.error("Error in getOrdersByEmployee:", err);
    res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong!"
    });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  assignMechanic,
  getOrdersByEmployee
};