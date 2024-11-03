import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IsAlive from "./IsAlive";
import "./networkCard.css";  // Mantener la importación de los estilos

interface Network {
  id: string;
  chainId: number;
  subnet: string;
  ipBootnode: string;
  isUp?: boolean;
}

const ListNetworks: React.FC = () => {
  const [networks, setNetworks] = useState<Network[]>([]);

  useEffect(() => {
    // Llamada al backend para obtener la lista de redes
    fetch("http://localhost:3000/networks")  // Asegúrate de actualizar la URL del endpoint según tu configuración de backend
      .then((response) => response.json())
      .then((data) => {
        setNetworks(data);  // Asignamos los datos recibidos del backend
      })
      .catch((error) => console.error("Error al obtener redes:", error));
  }, []);

  const handleUp = (id: string) => {
    fetch(`http://localhost:3000/up/${id}`, { method: 'POST' })
      .then((response) => response.json())
      .then(() => {
        setNetworks((prevNetworks) =>
          prevNetworks.map((net) => (net.id === id ? { ...net, isUp: true } : net))
        );
      })
      .catch((error) => console.error("Error al subir la red:", error));
  };

  const handleDown = (id: string) => {
    fetch(`http://localhost:3000/down/${id}`, { method: 'POST' })
      .then((response) => response.json())
      .then(() => {
        setNetworks((prevNetworks) =>
          prevNetworks.map((net) => (net.id === id ? { ...net, isUp: false } : net))
        );
      })
      .catch((error) => console.error("Error al bajar la red:", error));
  };

  const handleRestart = (id: string) => {
    fetch(`http://localhost:3000/restart/${id}`, { method: 'POST' })
      .then((response) => response.json())
      .then(() => {
        console.log(`Red ${id} reiniciada`);
      })
      .catch((error) => console.error("Error al reiniciar la red:", error));
  };

  return (
    <div className="container">
      <h1>Lista de Redes</h1>
      <Link to="/net/add">Añadir Nueva Red</Link>
      <div className="network-cards">
        {networks.map((net) => (
          <div key={net.id} className={`network-card ${net.isUp ? "up" : "down"}`}>
            <h2>Network ID: {net.id}</h2>
            <p>Chain ID: {net.chainId}</p>
            <p>Subnet: {net.subnet}</p>
            <p>IP Bootnode: {net.ipBootnode}</p>
            <div className="network-card-buttons">
              {net.isUp ? (
                <>
                  <button onClick={() => handleDown(net.id)}>Down</button>
                  <button onClick={() => handleRestart(net.id)}>Restart</button>
                </>
              ) : (
                <button onClick={() => handleUp(net.id)}>Up</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListNetworks;
