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
import { WalletProvider } from "./components/WalletContext";

export default function App() {
  const [networks, setNetworks] = useState<Network[]>([]);

  // Efecto para cargar las redes desde el backend al iniciar la aplicación
  useEffect(() => {
    fetch(`${API_BASE_URL}/network`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener las redes");
        }
        return res.json();
      })
      .then((data) => {
        setNetworks(data.data.networkList); // Guardamos las redes en el estado
      })
      .catch((error) => {
        console.error("Error al obtener redes:", error);
      });
  }, []);

  // Maneja la adición de una nueva red
  const handleAddNetwork = (newNetwork: Network) => {
    setNetworks((prev) => [...prev, newNetwork]);
  };

  // Maneja la selección de una red (puedes personalizar su lógica)
  const handleNetworkClick = (network: Network) => {
    console.log("Red seleccionada:", network);
  };

  return (
    // Aquí envolvemos toda la aplicación con el WalletProvider
    <WalletProvider>
      <div className="App">
        {/* Header sigue siendo el mismo, pero ahora tiene acceso al WalletContext */}
        <Header />

        {/* Contenido principal de la aplicación */}
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
      onDeleteNetwork={(networkId: string) => {
        setNetworks((prev) => prev.filter((network) => network.id !== networkId));
      }}
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
              <Route
                path="faucet"
                element={
                  <Faucet
                    networkId="1" // Cambia esto por el ID de la red correspondiente
                    onClose={() => console.log("Faucet cerrado")}
                    availableAccounts={[
                      { address: "0x123...", balance: 1.2 },
                      { address: "0x456...", balance: 0.8 },
                    ]} // Cambia esto por las cuentas reales
                  />
                }
              />
              <Route path="blocks" element={<Bloques />} />
            </Route>
          </Routes>
        </main>

        {/* Footer sigue siendo el mismo */}
        <Footer />
      </div>
    </WalletProvider>
  );
}
