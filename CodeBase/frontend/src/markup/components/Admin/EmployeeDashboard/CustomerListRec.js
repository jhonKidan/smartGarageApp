import React from 'react'
import CustomersList from '../CustomerList/CustomerList'
import Receptionistboard from './ReceptionistDashboard'

function CustomerListRec() {
  return (
     <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
           <Receptionistboard />
          </div>
          <div className="col-md-9 admin-right-side">
            <CustomersList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerListRec