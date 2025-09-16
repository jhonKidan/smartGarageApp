import React from "react";
import { useAuth } from "../../../Contexts/AuthContext";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import CustomersList from "../../components/Admin/CustomerList/CustomerList";

function Customers() {
  const { isLogged, employee } = useAuth();

  // Check if user is logged in and has the required role/type
  const hasAccess = isLogged && (
    employee?.employee_role === 3 || // Admin
    (employee?.employee_role === 1 && employee?.employee_type === "receptionist") // Receptionist
  );

  if (!isLogged) {
    return (
      <div>
        <h1>Please log in to access this page</h1>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div>
        <h1>You are not authorized to access this page</h1>
      </div>
    );
  }

  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <CustomersList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;