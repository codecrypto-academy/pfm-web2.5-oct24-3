import React, { useState } from "react";
import { Network } from "../types/Network";
import Faucet from "./Faucet"; // Importa el componente Faucet
import "./NetworkDetails.css";

interface NetworkDetailsProps {
  network: Network;
  onClose: () => void;
}

const NetworkDetails: React.FC<NetworkDetailsProps> = ({ network, onClose }) => {
  const [showFaucet, setShowFaucet] = useState(false); // Controla la visibilidad del Faucet

  // Mapeamos los datos de network.alloc para pasarlos a Faucet
  const availableAccounts = network.alloc.map((alloc) => ({
    address: alloc.address,
    balance: alloc.balance,
  }));

  return (
    <>
      {/* Fondo translúcido */}
      <div className="network-details-backdrop" onClick={onClose}></div>

      {/* Contenedor del modal */}
      <div className="network-details-modal">
        <div className="context-menu">
          <button className="close-menu-button" onClick={onClose}>
            X
          </button>
          <h2>Detalles de la Red</h2>
          <p><strong>Network ID:</strong> {network.id}</p>
          <p><strong>Chain ID:</strong> {network.chainId}</p>
          <p><strong>Subnet:</strong> {network.subnet}</p>
          <p><strong>IP Bootnode:</strong> {network.ipBootnode}</p>

          <h3>Alloc</h3>
          {network.alloc.map((alloc, index) => (
            <div key={index} className="network-details-line">
              <p><strong>Cuenta:</strong> {alloc.address}</p>
              <p><strong>Saldo:</strong> {alloc.balance}</p>
            </div>
          ))}

          <h3>Nodos</h3>
          {network.nodos.map((nodo, index) => (
            <div key={index} className="network-details-line">
              <p><strong>Tipo:</strong> {nodo.type}</p>
              <p><strong>Nombre:</strong> {nodo.name}</p>
              <p><strong>IP:</strong> {nodo.ip}</p>
              <p><strong>Puerto:</strong> {nodo.port}</p>
            </div>
          ))}

          {/* Botón para abrir el Faucet */}
          <button
            className="add-network-button"
            onClick={() => setShowFaucet(true)}
          >
            Hacer Faucet
          </button>
        </div>
      </div>

      {/* Renderiza el Faucet solo si está activado */}
      {showFaucet && (
      <Faucet
      networkId={network.id}
      onClose={() => setShowFaucet(false)}
      availableAccounts={network.alloc.map((alloc) => ({
        address: alloc.address,
        balance: alloc.balance ?? 0, // Asigna 0 si balance es undefined
      }))}
    />
    
      )}
    </>
  );
};

export default NetworkDetails;
