import React from "react";

const Footer = () => {
  return (
    <footer className="fk-footer">
      <div className="fk-footer-top">
        <div className="fk-footer-links-row">
          <div className="fk-footer-col">
            <div className="fk-footer-col-title">About</div>
            <a href="#">Contact Us</a>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Flipkart Stories</a>
            <a href="#">Press</a>
            <a href="#">Flipkart Wholesale</a>
            <a href="#">Corporate Information</a>
          </div>
          <div className="fk-footer-col">
            <div className="fk-footer-col-title">Help</div>
            <a href="#">Payments</a>
            <a href="#">Shipping</a>
            <a href="#">Cancellation &amp; Returns</a>
            <a href="#">FAQ</a>
            <a href="#">Report Infringement</a>
          </div>
          <div className="fk-footer-col">
            <div className="fk-footer-col-title">Consumer Policy</div>
            <a href="#">Cancellation &amp; Returns</a>
            <a href="#">Terms Of Use</a>
            <a href="#">Security</a>
            <a href="#">Privacy</a>
            <a href="#">Sitemap</a>
            <a href="#">Grievance Redressal</a>
            <a href="#">EPR Compliance</a>
          </div>
          <div className="fk-footer-col">
            <div className="fk-footer-col-title">Social</div>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">YouTube</a>
          </div>
        </div>

        <div className="fk-footer-address-row">
          <div className="fk-footer-address-col">
            <div className="fk-footer-col-title">Mail Us:</div>
            <div className="fk-address-text">
              Flipkart Internet Private Limited, <br />
              Buildings Alyssa, Begonia &amp; <br />
              Clove Embassy Tech Village, <br />
              Outer Ring Road, Devarabeesanahalli Village, <br />
              Bengaluru, 560103, <br />
              Karnataka, India
            </div>
          </div>
          <div className="fk-footer-address-col">
            <div className="fk-footer-col-title">Registered Office Address:</div>
            <div className="fk-address-text">
              Flipkart Internet Private Limited, <br />
              Buildings Alyssa, Begonia &amp; <br />
              Clove Embassy Tech Village, <br />
              Outer Ring Road, Devarabeesanahalli Village, <br />
              Bengaluru, 560103, <br />
              Karnataka, India <br />
              CIN : U51109KA2012PTC066107 <br />
              Telephone: <a href="tel:044-45614700" style={{ color: '#2874f0', display: 'inline', margin: 0, padding: 0 }}>044-45614700</a>
            </div>
          </div>
        </div>
      </div>

      <div className="fk-footer-bottom">
        <a href="#" className="fk-footer-bottom-item">
          <span style={{ color: '#ffe11b', fontSize: '16px' }}>🛍️</span> Become a Seller
        </a>
        <a href="#" className="fk-footer-bottom-item">
          <span style={{ color: '#ffe11b', fontSize: '16px' }}>⭐</span> Advertise
        </a>
        <a href="#" className="fk-footer-bottom-item">
          <span style={{ color: '#ffe11b', fontSize: '16px' }}>🎁</span> Gift Cards
        </a>
        <a href="#" className="fk-footer-bottom-item">
          <span style={{ color: '#ffe11b', fontSize: '16px' }}>❓</span> Help Center
        </a>
        <div className="fk-footer-bottom-item">
          &copy; 2007-2024 Flipkart.com
        </div>
        <div className="fk-payment-methods">
          <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg" alt="Payment Methods" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;