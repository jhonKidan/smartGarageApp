import React from 'react'
import ReceptionistDashboard from '../../components/Admin/EmployeeDashboard/ReceptionistDashboard'
import ReceptionistWelcomePage from '../../components/Admin/EmployeeDashboard/eceptionistWelcomePage'

function Receptionistboard() {
  return (
   <div>
        <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <ReceptionistDashboard />
          </div>
          <div className="col-md-9 admin-right-side">
          <ReceptionistWelcomePage/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Receptionistboard