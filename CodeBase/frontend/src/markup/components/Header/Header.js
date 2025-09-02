import React from 'react';
import { NavLink } from 'react-router-dom';  
import logoTwo from '../../../assets/images/logo-two.png';
import iconBar from '../../../assets/images/icons/icon-bar.png';
import customLogo from '../../../assets/images/custom/logo.png';
import loginService from '../../../services/login.service';
import { useAuth } from '../../../Contexts/AuthContext';
import '../../../assets/styles/custom.css';

function Header() {
  const { isLogged, setIsLogged, employee } = useAuth();

  const logOut = () => {
    loginService.logOut();
    setIsLogged(false);
  };

  return (
    <header className="main-header header-style-one">

      {/* Header Top */}
      <div className="header-top">
        <div className="auto-container">
          <div className="inner-container headerBg">
            <div className="left-column">
              <div className="text">Enjoy the Beso while we fix your car</div>
              <div className="office-hour">Monday - Saturday 7:00AM - 6:00PM</div>
            </div>
            <div className="right-column">
              {isLogged ? (
                <div className="phone-number">
                  Welcome <strong>{employee?.employee_first_name}</strong>
                </div>
              ) : (
                <div className="phone-number">
                  Schedule Your Appointment Today : <strong>1800 456 7890</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header Upper */}
      <div className="header-upper">
        <div className="auto-container">
          <div className="inner-container">
            {/* Logo */}
            <div className="logo-box">
              <div className="logo">
                <NavLink to="/"><img src={customLogo} alt="Logo" /></NavLink> {/* optional to use NavLink here */}
              </div>
            </div>

            {/* Right Column */}
            <div className="right-column">
              {/* Nav Box */}
              <div className="nav-outer">
                <div className="mobile-nav-toggler">
                  <img src={iconBar} alt="Menu" />
                </div>

                {/* Main Menu */}
                <nav className="main-menu navbar-expand-md navbar-light">
                  <div className="collapse navbar-collapse show clearfix" id="navbarSupportedContent">
                    <ul className="navigation">
                      <li>
                        <NavLink exact to="/" activeClassName="active">Home</NavLink>
                      </li>
                      <li>
                        <NavLink to="/about" activeClassName="active">About Us</NavLink>
                      </li>
                      <li>
                        <NavLink to="/services" activeClassName="active">Services</NavLink>
                      </li>
                      <li>
                        <NavLink to="/contact" activeClassName="active">Contact Us</NavLink>
                      </li>
                    </ul>
                  </div>
                </nav>
              </div>

              <div className="search-btn"></div>

              <div className="link-btn">
                {isLogged ? (
                  <NavLink to="/" className="theme-btn btn-style-one blue" onClick={logOut}>Log out</NavLink>
                ) : (
                  <NavLink to="/login" className="theme-btn btn-style-one">Login</NavLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Header */}
      <div className="sticky-header">
        <div className="header-upper">
          <div className="auto-container">
            <div className="inner-container">
              <div className="logo-box">
                <NavLink to="/"><img src={customLogo} alt="Sticky Logo" /></NavLink>
              </div>
              <nav className="main-menu navbar-expand-md navbar-light">
                <div className="collapse navbar-collapse show clearfix" id="navbarSupportedContent">
                  <ul className="navigation">
                    <li>
                      <NavLink exact to="/" activeClassName="active">Home</NavLink>
                    </li>
                    <li>
                      <NavLink to="/about" activeClassName="active">About Us</NavLink>
                    </li>
                    <li>
                      <NavLink to="/services" activeClassName="active">Services</NavLink>
                    </li>
                    <li>
                      <NavLink to="/contact" activeClassName="active">Contact Us</NavLink>
                    </li>
                  </ul>
                </div>
              </nav>
              <div className="right-column">
                <div className="nav-outer">
                  <div className="mobile-nav-toggler">
                    <img src={iconBar} alt="Menu" />
                  </div>
                  <nav className="main-menu navbar-expand-md navbar-light">
                    {/* Can add sticky menu here if needed */}
                  </nav>
                </div>
                <div className="search-btn"></div>
                <div className="link-btn">
                  {isLogged ? (
                    <NavLink to="/" className="theme-btn btn-style-one blue" onClick={logOut}>Log out</NavLink>
                  ) : (
                    <NavLink to="/login" className="theme-btn btn-style-one">Login</NavLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="mobile-menu">
        <div className="menu-backdrop"></div>
        <div className="close-btn"><span className="icon flaticon-remove"></span></div>

        <nav className="menu-box">
          <div className="nav-logo">
            <NavLink to="/">
              <img src={logoTwo} alt="Mobile Logo" />
            </NavLink>
          </div>
          <div className="menu-outer">
            {/* Menu will be generated via JavaScript if needed */}
          </div>
        </nav>
      </div>

      {/* Nav Overlay */}
      <div className="nav-overlay">
        <div className="cursor"></div>
        <div className="cursor-follower"></div>
      </div>
    </header>
  );
}

export default Header;
