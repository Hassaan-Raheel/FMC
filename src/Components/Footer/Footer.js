import React from "react";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="Footer">
      <div className="FooterMainClass">
        <span className="leftNote">
          © {currentYear}
          <p>
            <a
              href="https://zellesolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Zelle Solutions{" "}
            </a>
          </p>
          . All Rights Reserved.
        </span>
        <span className="rightNote">
          <a href="mailto:support@zellesolutions.com" className="footer-link">
            HELP ?
          </a>
        </span>
      </div>
    </footer>
  );
}

export default Footer;