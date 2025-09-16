import React from 'react'
import AddVehicleForm from '../AddVehiclePage'
import Receptionistboard from './ReceptionistDashboard'

function AddVehicleRec() {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
           <Receptionistboard />
          </div>
          <div className="col-md-9 admin-right-side">
            <AddVehicleForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddVehicleRec