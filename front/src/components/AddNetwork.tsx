import React, { useState } from "react";
import "./AddNetwork.css";
import basuraIcon from "/basura.svg"; // Importamos el ícono

interface Nodo {
  type: string;
  name: string;
  ip: string;
  port: number;
}

interface Alloc {
  address: string;
  balance: number;
}

interface Network {
  id: string;
  chainId: string;
  subnet: string;
  ipBootnode: string;
  alloc: Alloc[];
  nodos: Nodo[];
}

interface AddNetworkProps {
  onClose: () => void;
  onNetworkAdded: (newNetwork: Network) => void;
}

const AddNetwork: React.FC<AddNetworkProps> = ({ onClose, onNetworkAdded }) => {
  const [network, setNetwork] = useState<Network>({
    id: "",
    chainId: "",
    subnet: "",
    ipBootnode: "",
    alloc: [{ address: "", balance: 0 }],
    nodos: [{ type: "", name: "", ip: "", port: 0 }],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNetwork((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllocChange = (index: number, field: keyof Alloc, value: string | number) => {
    const updatedAlloc = [...network.alloc];
    updatedAlloc[index] = { ...updatedAlloc[index], [field]: value };
    setNetwork((prev) => ({ ...prev, alloc: updatedAlloc }));
  };

  const addAlloc = () => {
    setNetwork((prev) => ({
      ...prev,
      alloc: [...prev.alloc, { address: "", balance: 0 }],
    }));
  };

  const removeAlloc = (index: number) => {
    const updatedAlloc = [...network.alloc];
    updatedAlloc.splice(index, 1);
    setNetwork((prev) => ({ ...prev, alloc: updatedAlloc }));
  };

  const handleNodoChange = (
    index: number,
    field: keyof Nodo,
    value: string | number
  ) => {
    const updatedNodos = [...network.nodos];
    updatedNodos[index] = { ...updatedNodos[index], [field]: value };
    setNetwork((prev) => ({ ...prev, nodos: updatedNodos }));
  };

  const addNodo = () => {
    setNetwork((prev) => ({
      ...prev,
      nodos: [...prev.nodos, { type: "", name: "", ip: "", port: 0 }],
    }));
  };

  const removeNodo = (index: number) => {
    const updatedNodos = [...network.nodos];
    updatedNodos.splice(index, 1);
    setNetwork((prev) => ({ ...prev, nodos: updatedNodos }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Network data submitted:", network);
    onNetworkAdded(network);
    onClose();
  };

  return (
    <>
      <div className="add-network-backdrop" onClick={onClose}></div>

      <div className="add-network-modal">
        <button className="close-menu-button" onClick={onClose}>
          X
        </button>

        <div className="add-network-form">
          <div className="modal-header">
            <h2 className="modal-title">Añadir Red</h2>
            <span className="modal-subtitle">CONFIGURA TU RED PRIVADA DE ETH</span>
          </div>
          <div className="modal-divider"></div>

          <form onSubmit={handleSubmit} className="form-columns">
            <div className="input-row">
              <label htmlFor="network-id">Network ID:</label>
              <input
                id="network-id"
                type="text"
                name="id"
                value={network.id}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="chain-id">Chain ID:</label>
              <input
                id="chain-id"
                type="text"
                name="chainId"
                value={network.chainId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-row">
              <label htmlFor="subnet">Subnet:</label>
              <input
                id="subnet"
                type="text"
                name="subnet"
                value={network.subnet}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="ip-bootnode">IP Bootnode:</label>
              <input
                id="ip-bootnode"
                type="text"
                name="ipBootnode"
                value={network.ipBootnode}
                onChange={handleInputChange}
                required
                pattern="^(?:\d{1,3}\.){3}\d{1,3}$"
                title="Debe ser una dirección IP válida."
              />
            </div>

            <h3>Alloc:</h3>
            {network.alloc.map((alloc, index) => (
              <div key={index} className="alloc-item">
                <input
                  type="text"
                  placeholder="Cuenta Ethereum"
                  value={alloc.address}
                  onChange={(e) => handleAllocChange(index, "address", e.target.value)}
                  required
                  pattern="^0x[a-fA-F0-9]{40}$"
                  title="Debe ser una dirección Ethereum válida."
                />
                <input
                  type="number"
                  placeholder="Saldo"
                  value={alloc.balance === 0 ? "" : alloc.balance.toString()}
                  onChange={(e) =>
                    handleAllocChange(index, "balance", parseFloat(e.target.value))
                  }
                  required
                  min={0}
                />
                {network.alloc.length > 1 && (
                  <img
                    src={basuraIcon}
                    alt="Eliminar"
                    className="delete-icon"
                    onClick={() => removeAlloc(index)}
                  />
                )}
              </div>
            ))}
            <button type="button" onClick={addAlloc}>
              + Nuevo Alloc
            </button>

            <h3>Nodos:</h3>
            {network.nodos.map((nodo, index) => (
              <div key={index} className="nodo-item">
                <input
                  type="text"
                  placeholder="Tipo"
                  value={nodo.type}
                  onChange={(e) => handleNodoChange(index, "type", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nodo.name}
                  onChange={(e) => handleNodoChange(index, "name", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="IP"
                  value={nodo.ip}
                  onChange={(e) => handleNodoChange(index, "ip", e.target.value)}
                  required
                  pattern="^(?:\d{1,3}\.){3}\d{1,3}$"
                  title="Debe ser una dirección IP válida."
                />
                <input
                  type="number"
                  placeholder="Puerto"
                  value={nodo.port}
                  onChange={(e) =>
                    handleNodoChange(index, "port", parseInt(e.target.value, 10))
                  }
                  required
                  min={1}
                  max={65535}
                />
                {network.nodos.length > 1 && (
                  <button className="delete-nodo-button" onClick={() => removeNodo(index)}>
                    <img src={basuraIcon} alt="Eliminar Nodo" className="delete-icon" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addNodo}>
              Añadir Nodo
            </button>

            <button type="submit">Crear Red</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNetwork;
