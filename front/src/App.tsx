import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ListNetworks from "./components/ListNetworks";
import AddNetwork from "./components/AddNetwork";
import Operaciones from "./components/Operaciones";
import NetUp from "./components/NetUp";
import NetDown from "./components/NetDown";
import NetRestart from "./components/NetRestart";
import Transfer from "./components/Transfer";
import Faucet from "./components/Faucet";
import Bloques from "./components/Bloques";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";
import API_BASE_URL from "./apiConfig";
import { Network } from "./types/Network"; // Importamos los tipos

export default function App() {
  const [networks, setNetworks] = useState<Network[]>([
    {
      id: "red2", // Red simulada
      chainId: "21",
      subnet: "172.16.239.0/24",
      ipBootnode: "172.16.239.10",
      alloc: [],
      nodos: [],
      isUp: true, // Simulamos que esta red está activa
    },
  ]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/networks`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener las redes");
        }
        return res.json();
      })
      .then((data) => {
        setNetworks((prev) => [...prev, ...data]); // Añadimos las redes obtenidas a las ya simuladas
      })
      .catch((error) => {
        console.error("Error al obtener redes:", error);
      });
  }, []);

  const handleAddNetwork = (newNetwork: Network) => {
    setNetworks((prev) => [...prev, newNetwork]);
  };

  const handleNetworkClick = (network: Network) => {
    console.log("Red seleccionada:", network);
    // Aquí podemos implementar la lógica para abrir el menú contextual con los detalles de la red.
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                networks={networks}
                setNetworks={setNetworks}
                onNetworkClick={handleNetworkClick}
              />
            }
          />
          <Route
            path="/net/list"
            element={
              <ListNetworks
                networks={networks}
                setNetworks={setNetworks}
                onNetworkClick={handleNetworkClick}
              />
            }
          />
          <Route
            path="/net/add"
            element={<AddNetwork onClose={() => {}} onNetworkAdded={handleAddNetwork} />}
          />
          <Route path="/net/:id/operaciones" element={<Operaciones />}>
            <Route path="up" element={<NetUp />} />
            <Route path="down" element={<NetDown />} />
            <Route path="restart" element={<NetRestart />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="faucet" element={<Faucet />} />
            <Route path="blocks" element={<Bloques />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
