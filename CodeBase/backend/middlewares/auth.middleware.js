require("dotenv").config();
const jwt = require("jsonwebtoken");
const employeeService = require("../services/employee.service");

// Verify JWT token
const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    console.log("No token provided in request");
    return res.status(403).send({
      status: "fail",
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized!"
      });
    }
    req.employee_email = decoded.employee_email;
    req.employee = decoded;
    next();
  });
};

// Check if user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const decoded = req.employee;
    if (decoded && decoded.employee_role === 3) {
      console.log("Admin access granted via JWT for:", decoded.employee_email);
      return next();
    }

    console.log("Falling back to DB check for admin:", req.employee_email);
    const employee = await employeeService.getEmployeeByEmail(req.employee_email);
    if (employee && employee[0] && employee[0].company_role_id === 3) {
      console.log("Admin access granted via DB for:", req.employee_email);
      return next();
    }

    console.log("Admin access denied for:", req.employee_email);
    return res.status(403).send({
      status: "fail",
      error: "Not an Admin!"
    });
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error in authentication"
    });
  }
};

// Check if user is an admin or receptionist
const isAdminOrReceptionist = async (req, res, next) => {
  try {
    const decoded = req.employee;
    if (decoded) {
      const isAdminViaJWT = decoded.employee_role === 3;
      const isReceptionistViaJWT = decoded.employee_role === 1 && decoded.employee_type === "receptionist";
      if (isAdminViaJWT || isReceptionistViaJWT) {
        console.log("Admin/Receptionist access granted via JWT for:", decoded.employee_email);
        return next();
      }
    }

    console.log("Falling back to DB check for admin/receptionist:", req.employee_email);
    const employee = await employeeService.getEmployeeByEmail(req.employee_email);
    if (employee && employee[0]) {
      const isAdminViaDB = employee[0].company_role_id === 3;
      const isReceptionistViaDB = employee[0].company_role_id === 1 && employee[0].employee_type === "receptionist";
      if (isAdminViaDB || isReceptionistViaDB) {
        console.log("Admin/Receptionist access granted via DB for:", req.employee_email);
        return next();
      }
    }

    console.log("Admin/Receptionist access denied for:", req.employee_email);
    return res.status(403).send({
      status: "fail",
      error: "Not an Admin or Receptionist!"
    });
  } catch (error) {
    console.error("Error in isAdminOrReceptionist middleware:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error in authentication"
    });
  }
};

// Check if user is an admin or mechanic
const isAdminOrMechanic = async (req, res, next) => {
  try {
    const decoded = req.employee;
    if (decoded) {
      const isAdminViaJWT = decoded.employee_role === 3;
      const isMechanicViaJWT = decoded.employee_role === 1 && decoded.employee_type === "mechanic";
      if (isAdminViaJWT || isMechanicViaJWT) {
        console.log("Admin/Mechanic access granted via JWT for:", decoded.employee_email);
        return next();
      }
    }

    console.log("Falling back to DB check for admin/mechanic:", req.employee_email);
    const employee = await employeeService.getEmployeeByEmail(req.employee_email);
    if (employee && employee[0]) {
      const isAdminViaDB = employee[0].company_role_id === 3;
      const isMechanicViaDB = employee[0].company_role_id === 1 && employee[0].employee_type === "mechanic";
      if (isAdminViaDB || isMechanicViaDB) {
        console.log("Admin/Mechanic access granted via DB for:", req.employee_email);
        return next();
      }
    }

    console.log("Admin/Mechanic access denied for:", req.employee_email);
    return res.status(403).send({
      status: "fail",
      error: "Not an Admin or Mechanic!"
    });
  } catch (error) {
    console.error("Error in isAdminOrMechanic middleware:", error);
    return res.status(500).send({
      status: "error",
      message: "Internal server error in authentication"
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isAdminOrReceptionist,
  isAdminOrMechanic
};