import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IsAlive from "./IsAlive";

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
    // Llamada para obtener la lista de redes desde el backend
    fetch("http://localhost:3000")  // Cambia la URL si es necesario
      .then((response) => response.json())
      .then((data) => {
        // Asumimos que el backend devuelve el estado `isUp` para cada red
        setNetworks(data);
      })
      .catch((error) => console.error("Error al obtener redes:", error));
  }, []);

  // Funciones para manejar los eventos de los botones
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
      <table className="table">
        <thead>
          <tr>
            <th>Operaciones</th>
            <th>Estado</th>
            <th>Network ID</th>
            <th>Chain ID</th>
            <th>Subnet</th>
            <th>IP Bootnode</th>
          </tr>
        </thead>
        <tbody>
          {networks.map((net) => (
            <tr key={net.id}>
              <td>
                <Link to={`/net/${net.id}/edit`}>Editar</Link> |{" "}
                <Link to={`/net/${net.id}/operaciones`}>Operaciones</Link>
              </td>
              <td>
                <IsAlive id={net.id} isUp={net.isUp} />
                {/* Condicional para mostrar los botones según el estado */}
                <div>
                  {net.isUp ? (
                    <>
                      <button onClick={() => handleDown(net.id)}>Down</button>
                      <button onClick={() => handleRestart(net.id)}>Restart</button>
                    </>
                  ) : (
                    <button onClick={() => handleUp(net.id)}>Up</button>
                  )}
                </div>
              </td>
              <td>{net.id}</td>
              <td>{net.chainId}</td>
              <td>{net.subnet}</td>
              <td>{net.ipBootnode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListNetworks;
