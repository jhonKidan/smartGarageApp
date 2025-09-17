import React, { useState } from 'react';
import AddEmployeeForm from '../../components/Admin/AddEmployeeForm/AddEmployeeForm';
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu';

function AddEmployee({ onEmployeeAdded }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEmployeeAdded = () => {
    setRefreshTrigger(prev => prev + 1); // Increment to trigger refresh
    if (onEmployeeAdded) {
      onEmployeeAdded(); // Notify parent component (if needed)
    }
  };

  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <AddEmployeeForm onEmployeeAdded={handleEmployeeAdded} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;