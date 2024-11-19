import { useState } from "react";
import ListNetworks from "./ListNetworks";
import AddNetwork from "./AddNetwork";
import "./Home.css";
import "./Contextmenu.css"; // Asegúrate de importar los estilos del menú contextual
import { Network } from "../types/Network";

interface HomeProps {
  networks: Network[];
  setNetworks: React.Dispatch<React.SetStateAction<Network[]>>;
}

export default function Home({ networks, setNetworks }: HomeProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNetworkAdded = (newNetwork: Network) => {
    setNetworks((prev) => [...prev, newNetwork]);
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
      <ListNetworks networks={networks} setNetworks={setNetworks} />
    </div>
  );
}
