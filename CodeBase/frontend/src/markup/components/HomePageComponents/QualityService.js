import React from 'react'
import featureImage from '../../../assets/images/image-3.jpg';

function QualityService() {
  return (
    <section className="features-section">
            <div className="auto-container">
                <div className="row bgColor" >
                    <div className="col-lg-6">
                        <div className="inner-container ">
                            <h2>Quality Service And <br/> Customer Satisfaction !!</h2>
                            <div className="text">At the heart of everything we do is a commitment to quality service and complete customer satisfaction. Every repair, inspection, and tune-up is handled with precision, care, and professionalism—because your safety and trust matter most. We don’t just fix cars; we build lasting relationships by exceeding expectations, delivering transparent service, and making sure every customer drives away with confidence and peace of mind.</div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="image"><img src={featureImage} alt=""/></div>
                    </div>
                </div>
            </div>
        </section>
  )
}

export default QualityService