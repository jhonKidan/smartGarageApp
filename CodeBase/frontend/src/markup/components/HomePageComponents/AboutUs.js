import React from 'react';
import vban1 from '../../../assets/images/misc/vban1.jpg';
import vban2 from '../../../assets/images/misc/vban2.jpg';

function AboutUs() {
  return (
    <section className="about-section">
      <div className="auto-container">
        <div className="row">
          <div className="col-lg-5">
            <div className="image-box">
              <img src={vban1} alt="" />
              <img src={vban2} alt="" />
              <div className="year-experience" data-parallax='{"y": 30}'>
                <strong>5</strong> years <br />
                Experience
              </div>
            </div>
          </div>
          <div className="col-lg-7 pl-lg-5">
            <div className="sec-title">
              <h5>Welcome to Our workshop</h5>
              <h2>We have Money years experience</h2>
              <div className="text">
                <p>
                  We started with a simple mission—to redefine car care through trust, quality, and innovation. With years of hands-on experience and a passion for precision, our team treats every vehicle with the same care we’d give our own. From diagnostics to delivery, we’re committed to making your experience effortless and dependable.
                </p>
                <p>
                  At our core, we believe great service goes beyond repairs—it’s about building lasting relationships. Our garage is more than a workspace; it's a space where honesty, transparency, and customer satisfaction come first. Join us, and experience auto service the way it should be—personal, professional, and reliable.
                </p>
              </div>
              <div className="link-btn mt-40">
                <a href="about.html" className="theme-btn btn-style-one style-two">
                  <span>
                    About Us <i className="flaticon-right"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;

