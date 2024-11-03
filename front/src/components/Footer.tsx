// front/src/components/Footer.tsx
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="links">
          <a href="#about">Quiénes somos</a>
          <a href="#privacy">Privacidad</a>
          <a href="#terms">Términos y condiciones</a>
        </div>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="/facebook.svg" alt="Facebook" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="/instagram.svg" alt="Instagram" />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <img src="/tiktok.svg" alt="TikTok" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="/x.svg" alt="X" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <img src="/youtube.svg" alt="YouTube" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

