import React from "react";
import "./networkCard.css";
import { Network } from "../types/Network";
import API_BASE_URL from "../apiConfig";

interface ListNetworksProps {
  networks: Network[];
  setNetworks: React.Dispatch<React.SetStateAction<Network[]>>;
  onNetworkClick: (network: Network) => void;
  onDeleteNetwork: (networkId: string) => void; // Propiedad añadida para manejar eliminación
}

const ListNetworks: React.FC<ListNetworksProps> = ({
  networks,
  setNetworks,
  onNetworkClick,
  onDeleteNetwork, // Aseguramos que se recibe esta prop
}) => {
  const handleAction = (action: "up" | "down" | "restart", id: string) => {
    fetch(`${API_BASE_URL}/network/${action}/${id}`, { method: "GET" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al ejecutar la acción ${action} para la red ${id}`);
        }
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

  const handleDelete = (e: React.MouseEvent, networkId: string) => {
    e.stopPropagation(); // Evitar que el clic abra el menú de detalles
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta red?");
    if (confirmDelete) {
      onDeleteNetwork(networkId); // Llamar a la prop para eliminar la red
    }
  };

  return (
    <div className="container">
      <div className="network-cards">
        {networks.map((network) => (
          <div
            key={network.id}
            className={`network-card ${network.isUp ? "up" : "down"}`}
            onClick={() => onNetworkClick(network)} // Llama a la nueva prop al hacer clic
          >
            <div className="network-header">
              <h2>Network ID: {network.id}</h2>
              {/* Botón de eliminación */}
              <button
                className="delete-network-button"
                onClick={(e) => handleDelete(e, network.id)}
              >
                <img src="/basura.svg" alt="Eliminar red" />
              </button>
            </div>
            <p>Chain ID: {network.chainId}</p>
            <p>Subnet: {network.subnet}</p>
            <p>IP Bootnode: {network.ipBootnode}</p>
            <div className="network-card-buttons">
              {network.isUp ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar que el clic abra el menú de detalles
                      handleAction("down", network.id);
                    }}
                  >
                    Down
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction("restart", network.id);
                    }}
                  >
                    Restart
                  </button>
                </>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction("up", network.id);
                  }}
                >
                  Up
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListNetworks;
