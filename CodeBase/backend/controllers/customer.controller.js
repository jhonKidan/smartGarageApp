// Import the customer service
const customerService = require('../services/customer.service');

// Create the create customer controller
async function createCustomer(req, res, next) {
  const customerExists = await customerService.checkIfCustomerExists(req.body.customer_email);

  if (customerExists) {
    return res.status(400).json({
      error: "This email address is already associated with another employee!"
    });
  }

  try {
    const customerData = req.body;
    const customer = await customerService.createCustomer(customerData);

    if (!customer) {
      return res.status(400).json({
        error: "Failed to add the employee!"
      });
    }

    res.status(200).json({
      status: "true",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Something went wrong!"
    });
  }
}

// Controller: Get All Customers
async function getAllCustomers(req, res, next) {
  try {
    const customers = await customerService.getAllCustomers();

    if (!customers || customers.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No customers found",
      });
    }

    res.status(200).json({
      status: "success",
      data: customers,
    });
  } catch (err) {
    console.error("Error in getAllCustomers:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch customers",
    });
  }
}

// 🔹 Controller: Search Customers
async function searchCustomers(req, res, next) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        status: "error",
        message: "Search query is required",
      });
    }

    const customers = await customerService.searchCustomers(q);

    if (!customers || customers.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No customers found",
      });
    }

    res.status(200).json({
      status: "success",
      data: customers,
    });
  } catch (err) {
    console.error("Error in searchCustomers:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to search customers",
    });
  }
}

// NEW: Update Customer
async function updateCustomer(req, res, next) {
  const { id } = req.params;
  const customerData = req.body;
  try {
    const customer = await customerService.updateCustomer(id, customerData);
    if (!customer) {
      return res.status(404).json({
        status: "error",
        message: "Customer not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: customer,
    });
  } catch (err) {
    console.error("Error in updateCustomer:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to update customer",
    });
  }
}

// NEW: Delete Customer
async function deleteCustomer(req, res, next) {
  const { id } = req.params;
  try {
    const deleted = await customerService.deleteCustomer(id);
    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Customer not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Customer deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteCustomer:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to delete customer",
    });
  }
}

//// Export controllers
module.exports = {
  createCustomer,
  getAllCustomers,
  searchCustomers,
  updateCustomer,
  deleteCustomer,
};
