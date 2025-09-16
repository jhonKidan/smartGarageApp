const conn = require("../config/db.config");
const bcrypt = require("bcrypt");

// A function to check if employee exists in the database 
async function checkIfEmployeeExists(email) {
  const query = "SELECT * FROM employee WHERE employee_email = ? ";
  const rows = await conn.query(query, [email]);
  console.log(rows);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

// A function to create a new employee 
async function createEmployee(employee) {
  let createdEmployee = {};
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employee.employee_password, salt);
    const query = "INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)";
    const rows = await conn.query(query, [employee.employee_email, employee.active_employee]);
    if (rows.affectedRows !== 1) {
      return false;
    }
    const employee_id = rows.insertId;
    const query2 = "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone, employee_type) VALUES (?, ?, ?, ?, ?)";
    const rows2 = await conn.query(query2, [employee_id, employee.employee_first_name, employee.employee_last_name, employee.employee_phone, employee.employee_type || null]);
    const query3 = "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)";
    const rows3 = await conn.query(query3, [employee_id, hashedPassword]);
    const query4 = "INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)";
    const rows4 = await conn.query(query4, [employee_id, employee.company_role_id]);
    createdEmployee = {
      employee_id: employee_id
    };
  } catch (err) {
    console.log(err);
  }
  return createdEmployee;
}

// A function to get employee by ID
async function getEmployeeById(employeeId) {
  const query = `
    SELECT e.employee_id, e.employee_email, ei.employee_first_name, ei.employee_last_name, ei.employee_phone, ei.employee_type, er.company_role_id
    FROM employee e
    INNER JOIN employee_info ei ON e.employee_id = ei.employee_id
    INNER JOIN employee_role er ON e.employee_id = er.employee_id
    WHERE e.employee_id = ?
  `;
  const [rows] = await conn.query(query, [employeeId]);
  return rows[0] || null;
}

// A function to get employee by email
async function getEmployeeByEmail(employee_email) {
  const query = "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?";
  const rows = await conn.query(query, [employee_email]);
  return rows;
}

// A function to get all employees with optional mechanic filtering
async function getAllEmployees(queryParams = {}) {
  let query = `
    SELECT e.*, ei.employee_first_name, ei.employee_last_name, ei.employee_phone, ei.employee_type, er.company_role_id, cr.company_role_name
    FROM employee e
    INNER JOIN employee_info ei ON e.employee_id = ei.employee_id
    INNER JOIN employee_role er ON e.employee_id = er.employee_id
    INNER JOIN company_roles cr ON er.company_role_id = cr.company_role_id
    WHERE 1=1
  `;
  const params = [];

  if (queryParams.role && queryParams.type) {
    query += " AND er.company_role_id = ? AND ei.employee_type = ?";
    params.push(parseInt(queryParams.role), queryParams.type);
  }

  query += " ORDER BY e.employee_id DESC LIMIT 10";
  const rows = await conn.query(query, params);
  return rows;
}

// A function to search employees by first name, last name, or phone
async function searchEmployees(searchTerm) {
  const query = `
    SELECT e.*, ei.employee_first_name, ei.employee_last_name, ei.employee_phone, ei.employee_type, er.company_role_id, cr.company_role_name
    FROM employee e
    INNER JOIN employee_info ei ON e.employee_id = ei.employee_id
    INNER JOIN employee_role er ON e.employee_id = er.employee_id
    INNER JOIN company_roles cr ON er.company_role_id = cr.company_role_id
    WHERE ei.employee_first_name LIKE ? 
    OR ei.employee_last_name LIKE ? 
    OR ei.employee_phone LIKE ? 
    ORDER BY e.employee_id DESC LIMIT 10
  `;
  const searchPattern = `%${searchTerm}%`;
  const rows = await conn.query(query, [searchPattern, searchPattern, searchPattern]);
  return rows;
}

// A function to update an employee
async function updateEmployee(id, employeeData) {
  try {
    const { employee_email, employee_first_name, employee_last_name, employee_phone, company_role_id } = employeeData;
    const query1 = "UPDATE employee SET employee_email = ? WHERE employee_id = ?";
    const rows1 = await conn.query(query1, [employee_email, id]);
    if (rows1.affectedRows !== 1) {
      return false;
    }
    const query2 = "UPDATE employee_info SET employee_first_name = ?, employee_last_name = ?, employee_phone = ? WHERE employee_id = ?";
    const rows2 = await conn.query(query2, [employee_first_name, employee_last_name, employee_phone, id]);
    const query3 = "UPDATE employee_role SET company_role_id = ? WHERE employee_id = ?";
    const rows3 = await conn.query(query3, [company_role_id, id]);
    return { employee_id: id };
  } catch (err) {
    console.log(err);
    return false;
  }
}

// A function to delete an employee
async function deleteEmployee(id) {
  try {
    const query1 = "DELETE FROM employee_role WHERE employee_id = ?";
    const rows1 = await conn.query(query1, [id]);
    const query2 = "DELETE FROM employee_pass WHERE employee_id = ?";
    const rows2 = await conn.query(query2, [id]);
    const query3 = "DELETE FROM employee_info WHERE employee_id = ?";
    const rows3 = await conn.query(query3, [id]);
    const query4 = "DELETE FROM employee WHERE employee_id = ?";
    const rows4 = await conn.query(query4, [id]);
    return rows4.affectedRows === 1;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeById,
  getEmployeeByEmail,
  getAllEmployees,
  searchEmployees,
  updateEmployee,
  deleteEmployee
};