import React from "react";
import { useNavigate } from "react-router-dom";

function Appointment() {
  const navigate = useNavigate();

  const handleAppointmentClick = () => {
    navigate("/schedule-appointment");
  };

  return (
    <section className="cta-section">
      <div className="auto-container">
        <div className="wrapper-box appbgColor">
          <div className="left-column">
            <h3>Schedule Your Appointment Today</h3>
            <div className="text">Your Automotive Repair & Maintenance Service Specialist</div>
          </div>
          <div className="right-column">
            <div className="phone">+251 910 289 407</div>
            <div className="btn">
              <button onClick={handleAppointmentClick} className="theme-btn btn-style-one">
                <span>Appointment</span><i className="flaticon-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Appointment;