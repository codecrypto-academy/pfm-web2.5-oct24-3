// src/components/Operaciones.tsx
import React, { useEffect, useState } from "react";
import { Outlet, Link, useParams } from "react-router-dom";
import IsAlive from "./IsAlive";

const Operaciones: React.FC = () => {
  const [network, setNetwork] = useState<any>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${id}`);
        const data = await response.json();
        setNetwork(data);
      } catch (error) {
        console.error("Error fetching network data:", error);
      }
    };
    fetchNetworkData();
  }, [id]);

  return (
    <div>
      <h1>Operaciones</h1>
      <div className="operations-links">
        <Link to="faucet">Faucet</Link>
        <Link to="transfer">Transfer</Link>
        <Link to="up">Up</Link>
        <Link to="down">Down</Link>
        <Link to="restart">Restart</Link>
        <Link to="blocks">Blocks</Link>
      </div>
      <h3>Datos de la red <IsAlive id={id} /></h3>
      {network && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Chain ID</th>
              <th>Subnet</th>
              <th>Bootnode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{network.id}</td>
              <td>{network.chainId}</td>
              <td>{network.subnet}</td>
              <td>{network.ipBootnode}</td>
            </tr>
          </tbody>
        </table>
      )}
      <Outlet />
    </div>
  );
};

export default Operaciones;
