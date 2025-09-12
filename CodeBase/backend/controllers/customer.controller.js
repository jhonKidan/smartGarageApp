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

//// Export controllers
module.exports = {
  createCustomer,
  getAllCustomers,
  searchCustomers, // 🔹 export new controller
};
