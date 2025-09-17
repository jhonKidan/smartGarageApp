import React from 'react'
import Receptionistboard from './ReceptionistDashboard'
import AppointmentList from './AppointmentList'

function AppointmentListRec() {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
           <Receptionistboard />
          </div>
          <div className="col-md-9 admin-right-side">
           <AppointmentList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentListRec