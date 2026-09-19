import React from "react";
import { Link } from "react-router-dom";
import logo_laundry from "../assets/images/logo_laundry.jpeg";

function Navbar() {

return (

<nav className="laundry-navbar">

    <div className="navbar-container">


        {/* BRAND */}

        <Link 
            className="brand"
            to="/"
        >

            <img
                src={logo_laundry}
                alt="SURA MELATI Logo"
            />


            <div className="brand-text">

                <h3>
                    SURA MELATI
                </h3>

                <span>
                    E-LAUNDRY
                </span>

            </div>


        </Link>




        {/* MENU */}


        <div className="navbar-menu">


            <Link to="/">
                Home
            </Link>


            <Link to="/about">
                About
            </Link>


            <a href="#contact-section">
                Contact
            </a>


            <Link 
                to="/login"
                className="login-btn"
            >
                Login
            </Link>


        </div>


    </div>


</nav>

);

}


export default Navbar;