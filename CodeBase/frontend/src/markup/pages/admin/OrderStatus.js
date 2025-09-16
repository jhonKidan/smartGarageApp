import React from 'react'
import Receptionistboard from '../../components/Admin/EmployeeDashboard/ReceptionistDashboard'
import OrderStatusRec from '../../components/Admin/EmployeeDashboard/OrderStatusRec'

function OrderStatus() {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
           <Receptionistboard />
          </div>
          <div className="col-md-9 admin-right-side">
            <OrderStatusRec />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderStatus