// Import the dotenv package
require("dotenv").config();
// Import the jsonwebtoken package
const jwt = require("jsonwebtoken");
// Import the employee service 
const employeeService = require("../services/employee.service");

// A function to verify the token received from the frontend 
const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    console.log("No token provided in request"); // Debug log
    return res.status(403).send({
      status: "fail",
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message); // Debug log
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized!"
      });
    }
    // console.log("Here is the decoded token");
    // console.log(decoded);
    req.employee_email = decoded.employee_email;
    req.employee = decoded; // Store full decoded token for role/type checks
    next();
  });
};

// A function to check if the user is an admin (updated to use JWT where possible)
const isAdmin = async (req, res, next) => {
  try {
    const decoded = req.employee;
    if (decoded && decoded.employee_role === 3) {
      console.log("Admin access granted via JWT for:", decoded.employee_email); // Debug log
      return next();
    }

    // Fallback to DB if JWT role is missing/invalid
    console.log("Falling back to DB check for admin:", req.employee_email);
    const employee = await employeeService.getEmployeeByEmail(req.employee_email);
    if (employee && employee[0] && employee[0].company_role_id === 3) {
      console.log("Admin access granted via DB for:", req.employee_email); // Debug log
      return next();
    }

    console.log("Admin access denied for:", req.employee_email); // Debug log
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

// New: A function to check if the user is an admin or receptionist
const isAdminOrReceptionist = async (req, res, next) => {
  try {
    const decoded = req.employee;
    if (decoded) {
      const isAdminViaJWT = decoded.employee_role === 3;
      const isReceptionistViaJWT = decoded.employee_role === 1 && decoded.employee_type === "receptionist";
      if (isAdminViaJWT || isReceptionistViaJWT) {
        console.log("Admin/Receptionist access granted via JWT for:", decoded.employee_email); // Debug log
        return next();
      }
    }

    // Fallback to DB if JWT data is missing/invalid
    console.log("Falling back to DB check for admin/receptionist:", req.employee_email);
    const employee = await employeeService.getEmployeeByEmail(req.employee_email);
    if (employee && employee[0]) {
      const isAdminViaDB = employee[0].company_role_id === 3;
      const isReceptionistViaDB = employee[0].company_role_id === 1 && employee[0].employee_type === "receptionist";
      if (isAdminViaDB || isReceptionistViaDB) {
        console.log("Admin/Receptionist access granted via DB for:", req.employee_email); // Debug log
        return next();
      }
    }

    console.log("Admin/Receptionist access denied for:", req.employee_email); // Debug log
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

const authMiddleware = {
  verifyToken,
  isAdmin,
  isAdminOrReceptionist // New: Export for use in routes
};

module.exports = authMiddleware;