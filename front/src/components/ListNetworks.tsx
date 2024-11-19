import React from "react";
import "./networkCard.css";
import { Network } from "../types/Network"; // Importamos el tipo

interface ListNetworksProps {
  networks: Network[];
  setNetworks: React.Dispatch<React.SetStateAction<Network[]>>;
}

const ListNetworks: React.FC<ListNetworksProps> = ({ networks, setNetworks }) => {
  const handleAction = (action: "up" | "down" | "restart", id: string) => {
    fetch(`http://localhost:3333/${action}/${id}`, { method: "POST" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al ejecutar la acción ${action} para la red ${id}`);
        }
        return response.text();
      })
      .then(() => {
        if (action === "up") {
          setNetworks((prev) =>
            prev.map((net) => (net.id === id ? { ...net, isUp: true } : net))
          );
        } else if (action === "down") {
          setNetworks((prev) =>
            prev.map((net) => (net.id === id ? { ...net, isUp: false } : net))
          );
        }
      })
      .catch((error) => {
        console.error(`Error ejecutando la acción ${action} para la red ${id}:`, error);
      });
  };

  return (
    <div className="container">
      <div className="network-cards">
        {networks.map((network) => (
          <div
            key={network.id}
            className={`network-card ${network.isUp ? "up" : "down"}`}
          >
            <h2>Network ID: {network.id}</h2>
            <p>Chain ID: {network.chainId}</p>
            <p>Subnet: {network.subnet}</p>
            <p>IP Bootnode: {network.ipBootnode}</p>
            <div className="network-card-buttons">
              {network.isUp ? (
                <>
                  <button onClick={() => handleAction("down", network.id)}>Down</button>
                  <button onClick={() => handleAction("restart", network.id)}>
                    Restart
                  </button>
                </>
              ) : (
                <button onClick={() => handleAction("up", network.id)}>Up</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListNetworks;
