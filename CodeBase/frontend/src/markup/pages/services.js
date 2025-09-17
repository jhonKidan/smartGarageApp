import React from 'react'
import Service from '../components/AboutUsComponents/AboutUs'
import ServiceList from '../components/ServiceList'
import WhyChooseUs from '../components/HomePageComponents/WhyChooseUs'
import OrderStatus from '../components/OrderStatus'

function services() {
  return (
    <>
      <Service pageTitle="OurServices" heading="OurServices" />
      <ServiceList />
        <WhyChooseUs />
        <OrderStatus />
    </>
  )
}

export default services