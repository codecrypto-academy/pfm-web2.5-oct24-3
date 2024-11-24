import React from "react";
import { Network } from "../types/Network";

interface NetworkDetailsProps {
  network: Network;
  onClose: () => void;
}

const NetworkDetails: React.FC<NetworkDetailsProps> = ({ network, onClose }) => {
  return (
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
        <div key={index}>
          <p><strong>Cuenta:</strong> {alloc.address}</p>
          <p><strong>Saldo:</strong> {alloc.balance}</p>
        </div>
      ))}
      <h3>Nodos</h3>
      {network.nodos.map((nodo, index) => (
        <div key={index}>
          <p><strong>Tipo:</strong> {nodo.type}</p>
          <p><strong>Nombre:</strong> {nodo.name}</p>
          <p><strong>IP:</strong> {nodo.ip}</p>
          <p><strong>Puerto:</strong> {nodo.port}</p>
        </div>
      ))}
      <button className="add-network-button">Hacer Faucet</button>
    </div>
  );
};

export default NetworkDetails;
