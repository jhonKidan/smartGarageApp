import React from 'react';
import bg3 from '../../../assets/images/bg-3.jpg';

function PageHeader({ pageTitle = "About us", heading = "Car Repairing" }) {
  return (
    <section className="page-title" style={{ backgroundImage: `url(${bg3})` }}>
      <div className="auto-container">
        <h2>{pageTitle}</h2>
        <ul className="page-breadcrumb">
          <li><a href="index.html">home</a></li>
          <li>{pageTitle}</li>
        </ul>
      </div>
      <h1 data-parallax='{"x": 200}'>{heading}</h1>
    </section>
  );
}

export default PageHeader;

