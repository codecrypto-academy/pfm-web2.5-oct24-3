import { Link } from "react-router-dom";
import useWallet from "../customHooks/useWallet";
import "./Header.css";

export default function Header() {
  const { walletAddress, isConnected, connectWallet, disconnectWallet } = useWallet();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src="/logo.svg" alt="Logo" className="logo-image" />
          <h1 className="logo-text">Build Private Ethereum Networks</h1>
        </div>
        <nav className="nav">
          <Link to="/swap">Swap</Link>
          <Link to="/liquidity">Liquidity</Link>
          <Link to="/portfolio">Portfolio</Link>
        </nav>
        <div className="wallet-container">
          {isConnected ? (
            <div className="wallet-info">
              <span className="wallet-address">Conectado: {walletAddress}</span>
              <button className="disconnect-wallet" onClick={disconnectWallet}>
                Desconectar
              </button>
            </div>
          ) : (
            <button className="connect-wallet" onClick={connectWallet}>
              Conectar Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
