// front/src/components/Header.tsx
import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src="/logo.svg" alt="Logo" className="logo-image" />
          <h1>Build Private Ethereum Networks</h1>
        </div>
        <nav className="nav">
          <a href="#swap">Swap</a>
          <a href="#liquidity">Liquidity</a>
          <a href="#portfolio">Portfolio</a>
        </nav>
        <button className="connect-wallet">Connect Wallet</button>
      </div>
    </header>
  );
}

export default Header;

