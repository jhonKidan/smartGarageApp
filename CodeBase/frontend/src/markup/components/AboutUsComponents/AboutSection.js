import React from 'react'
import image8 from '../../../assets/images/image-8.jpg';

function AboutSection() {
  return (
    
    <section className="about-section-three">
        <div className="auto-container">
            <div className="row">
                <div className="col-lg-7">
                    <div className="content">
                        <h2>We are highly skilled mechanics <br/> for your car repair</h2>
                        <div className="text">
                            <p>Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.</p>
                            <p>Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information heading towards a streamlined cloud solution. User generated content in real-time will have multiple.</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="image"><img src={image8} alt=""/></div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default AboutSection