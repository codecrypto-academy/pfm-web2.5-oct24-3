import { useState } from "react";
import ListNetworks from "./ListNetworks";
import AddNetwork from "./AddNetwork";
import NetworkDetails from "./NetworkDetails";
import "./Home.css";
import { Network } from "../types/Network";
import { useWalletContext } from "./WalletContext"; // Importar el contexto de la wallet

interface HomeProps {
  networks: Network[];
  setNetworks: React.Dispatch<React.SetStateAction<Network[]>>;
  onNetworkClick: (network: Network) => void;
}

export default function Home({ networks, setNetworks }: HomeProps) {
  const { walletAddress } = useWalletContext(); // Accedemos a la dirección de la wallet desde el contexto

  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controla el menú para añadir redes
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null); // Controla el menú de detalles

  // Abrir/cerrar el menú contextual para añadir redes
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Maneja la adición de una nueva red
  const handleNetworkAdded = (newNetwork: Network) => {
    setNetworks((prev) => [...prev, newNetwork]);
  };

  // Abrir el menú contextual para los detalles de una red específica
  const openDetailsMenu = (network: Network) => {
    setSelectedNetwork(network);
  };

  const closeDetailsMenu = () => {
    setSelectedNetwork(null);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Lista de Redes</h1>
      {walletAddress && (
        <div className="wallet-info">
          {/* Mostrar el texto conectado */}
          Conectado: <span>{walletAddress}</span>
        </div>
      )}
      <button className="add-network-button" onClick={toggleMenu}>
        Añadir Red
      </button>

      {isMenuOpen && (
        <div className="add-network-context-menu">
          <AddNetwork onClose={closeMenu} onNetworkAdded={handleNetworkAdded} />
        </div>
      )}

      {selectedNetwork && (
        <div className="network-details-context-menu">
          <NetworkDetails network={selectedNetwork} onClose={closeDetailsMenu} />
        </div>
      )}

      <ListNetworks
        networks={networks}
        setNetworks={setNetworks}
        onNetworkClick={openDetailsMenu}
      />
    </div>
  );
}
