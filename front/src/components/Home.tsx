import { useState } from "react";
import ListNetworks from "./ListNetworks";
import AddNetwork from "./AddNetwork";
import NetworkDetails from "./NetworkDetails"; // Nuevo componente para los detalles de red
import "./Home.css";
import "./Contextmenu.css"; // Asegúrate de importar los estilos del menú contextual
import { Network } from "../types/Network";

interface HomeProps {
  networks: Network[];
  setNetworks: React.Dispatch<React.SetStateAction<Network[]>>;
  onNetworkClick: (network: Network) => void; // Añadimos la nueva prop
}


export default function Home({ networks, setNetworks }: HomeProps) {
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
      <button className="add-network-button" onClick={toggleMenu}>
        Añadir Red
      </button>
      {isMenuOpen && (
        <div className="context-menu floating-menu">
          <button className="close-menu-button" onClick={closeMenu}>
            &times;
          </button>
          <AddNetwork onClose={closeMenu} onNetworkAdded={handleNetworkAdded} />
        </div>
      )}
      {selectedNetwork && (
        <div className="context-menu floating-menu">
          <button className="close-menu-button" onClick={closeDetailsMenu}>
            &times;
          </button>
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
