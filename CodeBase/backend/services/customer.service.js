// Import the query function from the db.config.js file 
const conn = require("../config/db.config");
// Import the bcrypt module 
const bcrypt = require('bcrypt');

// A function to check if customer exists in the database 
async function checkIfCustomerExists(email) {
  const query = "SELECT * FROM customer_identifier WHERE customer_email = ?";
  const rows = await conn.query(query, [email]);
  return rows.length > 0;
}

// A function to create a new customer
async function createCustomer(customer) {
  let createdCustomer = {};
  try {
    const salt = await bcrypt.genSalt(10);
    const customerHash = await bcrypt.hash(customer.customer_email + Date.now(), salt);

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

    const customer_id = rows1.insertId;

    const query2 = `
      INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) 
      VALUES (?, ?, ?, ?)
    `;
    await conn.query(query2, [
      customer_id,
      customer.customer_first_name,
      customer.customer_last_name,
      customer.active_customer_status
    ]);

    createdCustomer = {
      customer_id: customer_id,
      customer_hash: customerHash
    };
  } catch (err) {
    console.error("Error creating customer:", err);
  }

  return createdCustomer;
}

// Get All Customers
async function getAllCustomers() {
  const query = `
    SELECT 
      ci.customer_id,
      ci.customer_email,
      ci.customer_phone_number,
      ci.customer_added_date,
      ci.customer_hash,
      info.customer_first_name,
      info.customer_last_name,
      info.active_customer_status
    FROM customer_identifier ci
    INNER JOIN customer_info info ON ci.customer_id = info.customer_id
    ORDER BY ci.customer_id DESC
    LIMIT 10;
  `;

  const rows = await conn.query(query);
  return rows;
}

// Search Customers by name, phone, or email
async function searchCustomers(searchTerm) {
  const query = `
    SELECT 
      ci.customer_id,
      ci.customer_email,
      ci.customer_phone_number,
      ci.customer_added_date,
      ci.customer_hash,
      info.customer_first_name,
      info.customer_last_name,
      info.active_customer_status
    FROM customer_identifier ci
    INNER JOIN customer_info info ON ci.customer_id = info.customer_id
    WHERE info.customer_first_name LIKE ?
       OR info.customer_last_name LIKE ?
       OR ci.customer_phone_number LIKE ?
       OR ci.customer_email LIKE ?
    ORDER BY ci.customer_id DESC;
  `;

  const likeQuery = `%${searchTerm}%`;
  const rows = await conn.query(query, [
    likeQuery,
    likeQuery,
    likeQuery,
    likeQuery
  ]);

  return rows;
}

// Get Customer by ID
async function getCustomerById(customerId) {
  const query = `
    SELECT 
      ci.customer_id,
      ci.customer_email,
      ci.customer_phone_number,
      info.customer_first_name,
      info.customer_last_name,
      info.active_customer_status
    FROM customer_identifier ci
    INNER JOIN customer_info info ON ci.customer_id = info.customer_id
    WHERE ci.customer_id = ?
  `;
  const rows = await conn.query(query, [customerId]);
  return rows.length > 0 ? rows[0] : null;
}

// NEW: Update Customer
async function updateCustomer(id, customerData) {
  try {
    const { customer_email, customer_phone_number, customer_first_name, customer_last_name, active_customer_status } = customerData;
    const query1 = "UPDATE customer_identifier SET customer_email = ?, customer_phone_number = ? WHERE customer_id = ?";
    const rows1 = await conn.query(query1, [customer_email, customer_phone_number, id]);
    if (rows1.affectedRows !== 1) return false;

    const query2 = "UPDATE customer_info SET customer_first_name = ?, customer_last_name = ?, active_customer_status = ? WHERE customer_id = ?";
    const rows2 = await conn.query(query2, [customer_first_name, customer_last_name, active_customer_status, id]);
    return { customer_id: id };
  } catch (err) {
    console.error("Error updating customer:", err);
    return false;
  }
}

// NEW: Delete Customer
async function deleteCustomer(id) {
  try {
    const query1 = "DELETE FROM customer_info WHERE customer_id = ?";
    const rows1 = await conn.query(query1, [id]);
    const query2 = "DELETE FROM customer_identifier WHERE customer_id = ?";
    const rows2 = await conn.query(query2, [id]);
    return rows2.affectedRows === 1;
  } catch (err) {
    console.error("Error deleting customer:", err);
    return false;
  }
}

module.exports = {
  checkIfCustomerExists,
  createCustomer,
  getAllCustomers,
  searchCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};