import React from 'react'
import AdminMenu from '../../components/Admin/AdminMenu/AdminMenu'
import ServicesList from '../../components/Admin/ServiceForm/ServiceList'
import AddServiceForm from '../../components/Admin/ServiceForm/AddServiceForm'
function AddService() {
  return (
     <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <ServicesList />
            <AddServiceForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddService