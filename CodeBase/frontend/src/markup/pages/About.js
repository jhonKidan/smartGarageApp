import React from 'react'
import PageHeader from '../components/AboutUsComponents/AboutUs'
import AboutSection from '../components/AboutUsComponents/AboutSection'
import AboutUsSec from '../components/AboutUsComponents/AboutUsSec'
import WhyChooseUs from '../components/HomePageComponents/WhyChooseUs'
import BottomBanner from '../components/HomePageComponents/ButtomBanner'
import Appointment from '../components/HomePageComponents/Appointment'

function About() {
  return (
    <>
      <PageHeader />
      <AboutSection />
        <AboutUsSec />
        <WhyChooseUs />
        <BottomBanner />
        <Appointment />
    </>
  )
}

export default About