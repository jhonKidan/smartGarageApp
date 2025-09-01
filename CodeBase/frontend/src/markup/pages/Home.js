import React from 'react';
import BottomBanner from '../components/HomePageComponents/ButtomBanner';
import AboutUs from '../components/HomePageComponents/AboutUs';
import FeatureService from '../components/HomePageComponents/FeatureService';
import QualityService from '../components/HomePageComponents/QualityService';
import WhyChooseUs from '../components/HomePageComponents/WhyChooseUs';
import VideoSection from '../components/HomePageComponents/VideoSection';
import Appointment from '../components/HomePageComponents/Appointment';

function Home(props) {
  return (
    <div>
      <BottomBanner />
      <AboutUs />
      <FeatureService />
      <QualityService />
      <WhyChooseUs />
      <VideoSection />
      <Appointment />
    </div>
  );
}

export default Home;