import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src="/logo.svg" alt="Logo" className="logo-image" />
          <h1 className="logo-text">Build Private Ethereum Networks</h1> {/* Clase añadida */}
        </div>
        <nav className="nav">
          <Link to="/swap">Swap</Link>
          <Link to="/liquidity">Liquidity</Link>
          <Link to="/portfolio">Portfolio</Link>
        </nav>
        <button className="connect-wallet">Connect Wallet</button>
      </div>
    </header>
  );
}
