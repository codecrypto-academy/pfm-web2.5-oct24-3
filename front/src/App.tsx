// src/App.tsx
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

function App() {
  return (
    <>
      <Header />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/net/add" element={<AddNetwork />} />
          <Route path="/net/list" element={<ListNetworks />} />
          <Route path="/net/:id/operaciones" element={<Operaciones />}>
            <Route path="up" element={<NetUp />} />
            <Route path="down" element={<NetDown />} />
            <Route path="restart" element={<NetRestart />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="faucet" element={<Faucet />} />
            <Route path="blocks" element={<Bloques />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
