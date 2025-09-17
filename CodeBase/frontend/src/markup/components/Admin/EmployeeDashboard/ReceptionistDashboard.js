import React from 'react';


function Receptionistboard(props) {
  return (
    <div>
      <div className="admin-menu">
        <h2>Receptionist Menu</h2>
      </div>
      <div className="list-group">
         <a href="/employee/appointments" className="list-group-item">Appointments List</a>
        <a href="/employee/add-customer" className="list-group-item">Add customer</a>
        <a href="/employee/customers" className="list-group-item">Customers List</a>
         <a href="/employee/add-vehicle" className="list-group-item">Add vehicle</a>
        <a href="/employee/add-orders" className="list-group-item">Add order</a>
        <a href="/employee/order-status" className="list-group-item">Orders List</a>
        <a href="/employee/service-list" className="list-group-item">Services List</a>

      </div>
    </div>
  );
}

export default Receptionistboard;