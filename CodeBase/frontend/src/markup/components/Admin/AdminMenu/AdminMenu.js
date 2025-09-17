import React from 'react';

function AdminMenu(props) {
  return (
    <div>
      <div className="admin-menu">
        <h2>Admin Menu</h2>
      </div>
      <div className="list-group">
        <a href="/admin/dashboard" className="list-group-item">Dashboard</a>
        <a href="/admin/add-employee" className="list-group-item">Add employee</a>
        <a href="/admin/employees" className="list-group-item">Employees List</a>
        <a href="/admin/add-customer" className="list-group-item">Add customer</a>
        <a href="/admin/customers" className="list-group-item">Customers List</a>
         <a href="/admin/add-vehicle" className="list-group-item">Add vehicle</a>
        <a href="/admin/add-orders" className="list-group-item">Add order</a>
        <a href="/admin/orders" className="list-group-item">Orders List</a>
        <a href="/admin/services" className="list-group-item">Services</a>
      </div>
    </div>
  );
}

export default AdminMenu;