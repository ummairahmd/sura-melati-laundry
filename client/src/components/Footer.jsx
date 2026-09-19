import React from "react";
import group from "../assets/images/group.jpeg";

import {
  FaFacebookF,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";

function Footer() {
  return (
    <footer id="contact-section" className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">

          <img
            src={group}
            alt="Sura Melati E-Laundry"
            className="footer-image"
          />

          <h2>SURA MELATI</h2>
          <span>E-LAUNDRY</span>

          <p className="footer-description">
            Providing reliable, convenient and professional self-service
            laundry solutions for the community.
          </p>

        </div>



        {/* Contact */}
        <div className="footer-column">

          <h3>Contact Information</h3>

          <address>

            <p>
              <FaMapMarkerAlt className="footer-icon" />
              Lot 3518, Jalan Melati,<br />
              Sura Melati,<br />
              23000 Dungun,<br />
              Terengganu
            </p>

            <p>
              <FaPhoneAlt className="footer-icon" />
              +60 12-328 5859
            </p>

            <p>
              <FaClock className="footer-icon" />
              Open 24 Hours
            </p>

          </address>

        </div>



        {/* Social */}
        <div className="footer-column">

          <h3>Follow Us</h3>

          <div className="footer-social">

            <a
              href="https://www.facebook.com/share/19L7ezwyBp/?mibextid=wwXIfrs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://wa.me/60123285859"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>

          </div>

        </div>

      </div>



      <div className="footer-bottom">

        <hr />

        <p>
          © 2026 <strong>Sura Melati E-Laundry</strong>. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;