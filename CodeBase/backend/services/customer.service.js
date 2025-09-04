// Import the query function from the db.config.js file 
const conn = require("../config/db.config");
// Import the bcrypt module 
const bcrypt = require('bcrypt');
// A function to check if customer exists in the database 
async function checkIfCustomerExists(email) {
 const query = "SELECT * FROM customer_identifier WHERE customer_email = ?";

  const rows = await conn.query(query, [email]);
  console.log(rows);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

// A function to create a new customer
async function createCustomer(customer) {
  let createdCustomer = {};
  try {
    // Generate a hash for customer (can be used as unique identifier)
    const salt = await bcrypt.genSalt(10);
    const customerHash = await bcrypt.hash(customer.customer_email + Date.now(), salt);

    // 1. Insert into customer_identifier
    const query1 = `
      INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) 
      VALUES (?, ?, ?)
    `;
    const rows1 = await conn.query(query1, [
      customer.customer_email,
      customer.customer_phone_number,
      customerHash
    ]);

    if (rows1.affectedRows !== 1) {
      return false;
    }

    // Get the customer_id from insert
    const customer_id = rows1.insertId;

    // 2. Insert into customer_info
    const query2 = `
      INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) 
      VALUES (?, ?, ?, ?)
    `;
    const rows2 = await conn.query(query2, [
      customer_id,
      customer.customer_first_name,
      customer.customer_last_name,
      customer.active_customer_status
    ]);

    // Construct return object
    createdCustomer = {
      customer_id: customer_id,
      customer_hash: customerHash
    };

  } catch (err) {
    console.error("Error creating customer:", err);
  }

  // Return the created customer object
  return createdCustomer;
}
// Export the functions
module.exports = {
  checkIfCustomerExists,
  createCustomer
};