import React from 'react';


function Receptionistboard(props) {
  return (
    <div>
      <div className="admin-menu">
        <h2>Receptionist Menu</h2>
      </div>
      <div className="list-group">
         <a href="/employee/appointments" className="list-group-item">Appointment List</a>
        <a href="/employee/add-customer" className="list-group-item">Add customer</a>
        <a href="/employee/customers" className="list-group-item">Customers List</a>
         <a href="/admin/add-vehicle" className="list-group-item">Add vehicle</a>
        <a href="/admin/add-orders" className="list-group-item">Add order</a>
      </div>
    </div>
  );
}

export default Receptionistboard;