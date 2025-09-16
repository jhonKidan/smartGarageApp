import React from 'react';
// Import the AddCustomerForm component 
import AddCustomerForm from '../AddCustomerForm/AddCustomerForm';
// Import the AdminMenu component 
import Receptionistboard from './ReceptionistDashboard';

function AddCustomerRec(props) {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
           <Receptionistboard />
          </div>
          <div className="col-md-9 admin-right-side">
            <AddCustomerForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCustomerRec;