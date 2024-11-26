import React, { useState } from "react";
import "./AddNetwork.css";
import API_BASE_URL from "../apiConfig";

interface Nodo {
  type: string;
  name: string;
  ip: string;
  port?: number;
}

interface Network {
  id: string;
  chainId: number | undefined;
  subnet: string;
  ipBootnode: string;
  alloc: string[];
  nodos: Nodo[];
}

interface AddNetworkProps {
  onClose: () => void;
  onNetworkAdded: (newNetwork: Network) => void;
}

const AddNetwork: React.FC<AddNetworkProps> = ({ onClose }) => {
  const [network, setNetwork] = useState<Network>({
    id: "",
    chainId: undefined,
    subnet: "",
    ipBootnode: "",
    alloc: [""],
    nodos: [{ type: "rpc", name: "", ip: "", port: 0 }],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNetwork((prev) => ({
      ...prev,
      [name]: name === "chainId" ? Number(value) : value }));
  };

  const handleAllocChange = (index: number, value: string) => {
    const updatedAlloc = [...network.alloc];
    updatedAlloc[index] = value;
    setNetwork((prev) => ({ ...prev, alloc: updatedAlloc }));
  };

  const addAlloc = () => {
    setNetwork((prev) => ({
      ...prev,
      alloc: [...prev.alloc, ""],
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
      nodos: [...prev.nodos, { type: "rpc || miner || normal", name: "", ip: "", port: 0 }],
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
    fetch(`${API_BASE_URL}/network`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(network)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al crear la red');
        }
      })
      
    onClose();
  };

  return (
    <>
      {/* Fondo translúcido (backdrop) */}
      <div className="add-network-backdrop" onClick={onClose}></div>

      {/* Contenedor del modal */}
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
            {/* Primera línea de inputs */}
            <div className="input-row">
              <label htmlFor="network-id" className="label-network-id">Network ID:</label>
              <input
                id="network-id"
                type="text"
                name="id"
                value={network.id}
                onChange={handleInputChange}
                required
                className="input-network-id"
              />
              <label htmlFor="chain-id" className="label-chain-id">Chain ID:</label>
              <input
                id="chain-id"
                type="text"
                name="chainId"
                value={network.chainId ?? ""}
                onChange={handleInputChange}
                required
                className="input-chain-id"
              />
            </div>

            {/* Segunda línea de inputs */}
            <div className="input-row">
              <label htmlFor="subnet" className="label-subnet">Subnet:</label>
              <input
                id="subnet"
                type="text"
                name="subnet"
                value={network.subnet}
                onChange={handleInputChange}
                required
                className="input-subnet"
              />
              <label htmlFor="ip-bootnode" className="label-ip-bootnode">IP Bootnode:</label>
              <input
                id="ip-bootnode"
                type="text"
                name="ipBootnode"
                value={network.ipBootnode}
                onChange={handleInputChange}
                required
                pattern="^(?:\d{1,3}\.){3}\d{1,3}$"
                title="Debe ser una dirección IP válida."
                className="input-ip-bootnode"
              />
            </div>

            {/* Inputs de Alloc */}
            <h3 className="alloc-title">Alloc:</h3>
            {network.alloc.map((alloc, index) => (
              <div key={index} className="alloc-item">
                <input
                  type="text"
                  placeholder="Cuenta Ethereum"
                  value={alloc}
                  onChange={(e) => handleAllocChange(index, e.target.value)}
                  required
                  pattern="^0x[a-fA-F0-9]{40}$"
                  title="Debe ser una dirección Ethereum válida."
                />
                {network.alloc.length > 1 && (
                  <img
                    src="/basura.svg" // Ruta al icono
                    alt="Eliminar"
                    className="delete-icon" // Clase para estilizar el icono
                    onClick={() => removeAlloc(index)} // Lógica para eliminar
                  />
                )}

              </div>
            ))}
            <button type="button" className="new-alloc-button" onClick={addAlloc}>
              + Nuevo Alloc
            </button>


            {/* Inputs de Nodo */}
            <h3 className="nodos-title">Nodos:</h3>

            {network.nodos.map((nodo, index) => (
              <div key={index} className="nodo-item">
                <select
                  value={nodo.type}
                  onChange={(e) => handleNodoChange(index, "type", e.target.value)}
                  required
                >
                  <option value={"rpc"}>RPC</option>
                  <option value={"miner"}>Miner</option>
                  <option value={"normal"}>Normal</option>
                </select>
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
                  type="text"
                  placeholder="Puerto"
                  value={nodo.port}
                  onChange={(e) =>
                    handleNodoChange(index, "port", parseInt(e.target.value, 10))
                  }
                  required
                  max={65535}
                />
                {network.nodos.length > 1 && (
                  <button type="button" onClick={() => removeNodo(index)}>
                    Eliminar Nodo
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="new-node-button" onClick={addNodo}>
              Añadir Nodo
            </button>


            {/* Botón Crear Red */}
            <button type="submit" className="create-network-button">
              Crear Red
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNetwork;


