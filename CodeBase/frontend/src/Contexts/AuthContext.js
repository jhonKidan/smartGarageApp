import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
// Import the Util function to handle local storage
import getAuth from "../util/auth";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the logged-in user from local storage
    const loggedInEmployee = getAuth();
    loggedInEmployee
      .then((response) => {
        if (response && response.employee_token) {
          setIsLogged(true);
          setEmployee(response);
          // Set admin status based on role (3 for Admin)
          if (response.employee_role === 3) {
            setIsAdmin(true);
          }
          console.log("Auth restored from localStorage:", { role: response.employee_role, type: response.employee_type }); // Debug log
        } else {
          setIsLogged(false);
          setEmployee(null);
          setIsAdmin(false);
        }
      })
      .catch((error) => {
        console.error("Error restoring auth from localStorage:", error);
        setIsLogged(false);
        setEmployee(null);
        setIsAdmin(false);
      });
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employee/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        if (data.data.employee_token) {
          const decodedToken = JSON.parse(atob(data.data.employee_token.split(".")[1]));
          const employeeData = {
            employee_token: data.data.employee_token,
            employee_role: decodedToken.employee_role,
            employee_email: decodedToken.employee_email,
            employee_id: decodedToken.employee_id,
            employee_first_name: decodedToken.employee_first_name,
            employee_type: decodedToken.employee_type || null, // Sub-role for employees
          };
          localStorage.setItem("employee", JSON.stringify(employeeData));
          setIsLogged(true);
          setEmployee(employeeData);
          // Set admin status
          if (employeeData.employee_role === 3) {
            setIsAdmin(true);
          }
          console.log("Login successful:", { role: employeeData.employee_role, type: employeeData.employee_type }); // Debug log
          // Redirect based on role and sub-role
          switch (employeeData.employee_role) {
            case 3: // Admin
              navigate("/admin/dashboard");
              break;
            case 2: // Manager
              navigate("/manager/dashboard");
              break;
            case 1: // Employee
              if (employeeData.employee_type === "receptionist") {
                navigate("/employee/receptionist-dashboard");
              } else if (employeeData.employee_type === "mechanic") {
                navigate("/employee/assigned-orders");
              } else {
                navigate("/employee/dashboard");
              }
              break;
            default:
              navigate("/unauthorized");
          }
        }
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("employee");
    setIsLogged(false);
    setIsAdmin(false);
    setEmployee(null);
    navigate("/login");
  };

  // Helper function to check role-based access (e.g., for components like Customers.js)
  const hasRoleAccess = (allowedRoles) => {
    if (!employee) return false;
    return allowedRoles.some((role) => {
      if (typeof role === "number") {
        return employee.employee_role === role;
      } else if (role.role && role.type) {
        return employee.employee_role === role.role && employee.employee_type === role.type;
      }
      return false;
    });
  };

  const value = { 
    isLogged, 
    isAdmin, 
    employee, 
    login, 
    logout,
    hasRoleAccess // New: Reusable role check
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};