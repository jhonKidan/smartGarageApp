import React from 'react'
import Service from '../components/AboutUsComponents/AboutUs'
import FeatureService from '../components/HomePageComponents/FeatureService'
import WhyChooseUs from '../components/HomePageComponents/WhyChooseUs'

function services() {
  return (
    <>
      <Service pageTitle="OurServices" heading="OurServices" />
      <FeatureService />
        <WhyChooseUs />
    </>
  )
}

export default services