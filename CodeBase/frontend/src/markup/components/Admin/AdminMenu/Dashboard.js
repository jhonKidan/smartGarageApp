import React from 'react'

function Dashboard() {
  return (
   <section className="services-section">
            <div className="auto-container">
                <div className="sec-title style-two">
                    <h2>Admin Dashboard</h2>
                    <div className="text">The order management panel provides an overview of all customer orders. Admins can monitor, update, and organize requests from here.
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 service-block-one">
                        <div className="inner-box hvr-float-shadow">
                            <h5>Total</h5>
                            <h2>Employee</h2>
                            <a href="#" className="read-more">Total Employee</a>
                            <div className="icon"><span className="flaticon-power"></span></div>
                        </div>
                    </div>
                    <div className="col-lg-4 service-block-one">
                        <div className="inner-box hvr-float-shadow">
                            <h5>Total</h5>
                            <h2>Customer</h2>
                            <a href="#" className="read-more">Total Customer</a>
                            <div className="icon"><span className="flaticon-gearbox"></span></div>
                        </div>
                    </div>
                    <div className="col-lg-4 service-block-one">
                        <div className="inner-box hvr-float-shadow">
                            <h5>Total</h5>
                            <h2>Orders</h2>
                            <a href="#" className="read-more">Total Orders</a>
                            <div className="icon"><span className="flaticon-brake-disc"></span></div>
                        </div>
                    </div>
                    <div className="col-lg-4 service-block-one">
                        <div className="inner-box hvr-float-shadow">
                            <h5>Total</h5>
                            <h2>Service</h2>
                            <a href="#" className="read-more">Total Service</a>
                            <div className="icon"><span className="flaticon-tire"></span></div>
                        </div>
                    </div>
                    <div className="col-lg-4 service-block-one">
                        <div className="inner-box hvr-float-shadow">
                            <h5>Total</h5>
                            <h2>Assigned Orders</h2>
                            <a href="#" className="read-more">Total Assigned</a>
                            <div className="icon"><span className="flaticon-tire"></span></div>
                        </div>
                    </div>
                    <div className="col-lg-4 service-block-one">
                        <div className="inner-box hvr-float-shadow">
                            <h5>Total</h5>
                            <h2> Complated Order</h2>
                            <a href="#" className="read-more">Total Completed</a>
                            <div className="icon"><span className="flaticon-spray-gun"></span></div>
                        </div>
                    </div>
                   
                </div>
            </div>
        </section>
  )
}

export default Dashboard