import React from 'react'
import CreateOrderPage from '../CreateOrderPage'
import Receptionistboard from './ReceptionistDashboard'

function AddOrderRec() {
  return (
     <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
           <Receptionistboard />
          </div>
          <div className="col-md-9 admin-right-side">
            <CreateOrderPage />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddOrderRec