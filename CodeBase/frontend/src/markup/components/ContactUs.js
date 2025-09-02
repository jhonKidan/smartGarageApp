import React from 'react';
import '../../assets/styles/custom.css';


function ContactUs() {
  return (
    <section className="contact-section">
      <div className="contact-wrapper">

        {/* Map */}
        <div className="map-section">
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3071.2910802067827!2d90.45905169331171!3d23.691532202989123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1577214205224!5m2!1sen!2sbd"
              width="100%"
              height="470"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Company Location"
            ></iframe>
          </div>
        </div>

        {/* Contact Info */}
        <div className="info-column">
          <div className="inner-column">
            <h4>Our Address</h4>
            <div className="text">
              Visit us at our office location below. We’re always ready to welcome you.

            </div>
            <ul>
              <li>
                <i className="flaticon-pin"></i>
                <span>Address:</span> AddisAbeba, Ethiopia
              </li>
              <li>
                <i className="flaticon-email"></i>
                <span>Email:</span> jhonkidan.777@gmail.com
              </li>
              <li>
                <i className="flaticon-phone"></i>
                <span>Phone:</span> +251 910 289 407 / +251 941 800 438
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ContactUs;

