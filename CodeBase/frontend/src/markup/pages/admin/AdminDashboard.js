import React from 'react'
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'
import AdminDashboardMain from '../../components/Admin/AdminMenu/Dashboard'

function AdminDashboard() {
  return (
    <div>
        <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <AdminDashboardMain />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard