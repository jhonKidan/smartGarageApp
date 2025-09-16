import React from "react";
import { useAuth } from "../../../Contexts/AuthContext";
import LoginForm from '../../components/LoginForm/LoginForm';
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import AddVehiclePage from "../../components/Admin/AddVehiclePage";

function AddVehicle() {
  const { isLogged, hasRoleAccess } = useAuth();

  // Check if user has access (Admin: role 3, Receptionist: role 1 + type "receptionist")
  const hasAccess = hasRoleAccess([3, { role: 1, type: "receptionist" }]);

  if (!isLogged) {
    return (
      <div>
        <LoginForm />
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
            <AddVehiclePage />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddVehicle;