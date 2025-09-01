import React from 'react'
import Contact from '../components/AboutUsComponents/AboutUs'
import OurContact from '../components/ContactUs';
import Appointment from '../components/HomePageComponents/Appointment';
function contact() {
  return (
    <>
      <Contact pageTitle="ContactUs" heading="ContactUs" />
      <OurContact />
        <Appointment />
    </>
  )
}

export default contact