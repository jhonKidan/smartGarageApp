import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./markup/pages/Home";
import About from "./markup/pages/About";
import Services from "./markup/pages/services";
import Contact from "./markup/pages/contact";
import Login from "./markup/pages/Login";
import AdminDashboard from "./markup/pages/admin/AdminDashboard";
import ManagerDashboard from "./markup/pages/admin/AdminDashboard";
import AddEmployee from "./markup/pages/admin/AddEmployee";
import AddCustomer from "./markup/pages/admin/AddCustomer";
import Unauthorized from "./markup/pages/Unauthorized";
import Employees from "./markup/pages/admin/Employees";
import Customers from "./markup/pages/admin/Customers";
import AddVehicle from "./markup/pages/admin/AddVehicle";
import AddService from "./markup/pages/admin/AddService";
import AddOrders from "./markup/pages/admin/Orders";
import AllOrders from "./markup/pages/admin/AllOrders";
import Appointment from "./markup/components/HomePageComponents/AppointmentForm";
import Receptionistboard from "./markup/pages/admin/Receptionistboard";
import AssignedOrders from "./markup/pages/admin/AssignedOrders"; 

//import receptionist menu
import AddCustomerRec from "./markup/components/Admin/EmployeeDashboard/AddCustomerRec";
import AppointmentList from "./markup/components/Admin/EmployeeDashboard/AppointmentList";
import CustomerListRec from "./markup/components/Admin/EmployeeDashboard/CustomerListRec";
import AddVehicleRec from "./markup/components/Admin/EmployeeDashboard/AddVehicleRec";
import AddOrderRec from "./markup/components/Admin/EmployeeDashboard/AddOrderRec";

// Styles
import "./assets/template_assets/css/bootstrap.css";
import "./assets/template_assets/css/style.css";
import "./assets/template_assets/css/responsive.css";
import "./assets/template_assets/css/color.css";
import "./assets/styles/custom.css";

// Components
import Header from "./markup/components/Header/Header";
import Footer from "./markup/components/Footer/Footer";
import PrivateAuthRoute from "./markup/components/Auth/PrivateAuthRoute";

function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/admin/add-vehicle" element={<AddVehicle />} />
        <Route path="/admin/services" element={<AddService />} />
        <Route path="/admin/add-orders" element={<AddOrders />} />
        <Route path="/admin/orders" element={<AllOrders />} />
        <Route path="/schedule-appointment" element={<Appointment />} />

      {/* receptionalist board route */}
        <Route path="/employee/add-customer" element={<AddCustomerRec />} />
        <Route path="/employee/appointments" element={<AppointmentList />} />
        <Route path="/employee/customers" element={<CustomerListRec />} />
        <Route path="/employee/add-vehicle" element={<AddVehicleRec />} />
        <Route path="/employee/add-orders" element={<AddOrderRec />} />
  


        {/* Admin Routes (Role 3) */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateAuthRoute roles={[3]}>
              <AdminDashboard />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/add-employee"
          element={
            <PrivateAuthRoute roles={[3]}>
              <AddEmployee />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <PrivateAuthRoute roles={[3]}>
              <Employees />
            </PrivateAuthRoute>
          }
        />

        {/* Manager Routes (Role 2) */}
        <Route
          path="/manager/dashboard"
          element={
            <PrivateAuthRoute roles={[2]}>
              <ManagerDashboard />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <PrivateAuthRoute roles={[1,2, 3]}>
              <Customers />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/add-customer"
          element={
            <PrivateAuthRoute roles={[1,2, 3]}>
              <AddCustomer />
            </PrivateAuthRoute>
          }
        />

        

       <Route
          path="/employee/receptionist-dashboard"
          element={
            <PrivateAuthRoute roles={[1]}>
              <Receptionistboard />
            </PrivateAuthRoute>
          }
        />

         <Route
          path="/employee/assigned-orders"
          element={
            <PrivateAuthRoute roles={[1]}>
              <AssignedOrders />
            </PrivateAuthRoute>
          }
        />

      </Routes>
      <Footer />
    </>
  );
}

export default App;
