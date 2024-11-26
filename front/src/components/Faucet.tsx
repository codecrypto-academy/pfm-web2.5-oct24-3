import React, { useState, useEffect } from "react";
import { ethers } from "ethers"; // Importación correcta para ethers v6
import "./Faucet.css";

interface FaucetProps {
  networkId: string;
  onClose: () => void;
  availableAccounts: { address: string; balance: number }[];
}

const Faucet: React.FC<FaucetProps> = ({ networkId, onClose, availableAccounts }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0.1);
  const [tx, setTx] = useState<any | null>(null);
  const [currentNetwork, setCurrentNetwork] = useState<number | null>(null);
  const [connectedBalance, setConnectedBalance] = useState<number | null>(null); // Usar balance conectado

  useEffect(() => {
    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      alert("MetaMask no está instalado. Por favor, instálalo para continuar.");
      return;
    }

    // Escuchar cambios de cuenta
    ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        fetchBalance(accounts[0]); // Obtener balance al cambiar de cuenta
      } else {
        alert("MetaMask no tiene ninguna cuenta conectada.");
        setAccount(null);
      }
    });

    // Conexión inicial con MetaMask
    ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts: string[]) => {
        setAccount(accounts[0]);
        fetchBalance(accounts[0]); // Obtener balance inicial
      })
      .catch((error: any) => {
        console.error("Error al conectar MetaMask:", error);
        alert("No se pudo conectar a MetaMask.");
      });

    // Obtener red activa en MetaMask
    const provider = new ethers.BrowserProvider(ethereum); // Actualizado para ethers v6
    provider.getNetwork().then((network: ethers.Network) => {
      setCurrentNetwork(network.chainId);
    });
  }, []);

  // Función para obtener el balance de la cuenta conectada
  const fetchBalance = async (account: string) => {
    try {
      const ethereum = (window as any).ethereum;
      const provider = new ethers.BrowserProvider(ethereum); // Actualizado para ethers v6
      const balance = await provider.getBalance(account); // Obtener balance como BigInt
      const balanceInEther = parseFloat(ethers.formatEther(balance)); // Convertir a ETH como número
      setConnectedBalance(balanceInEther); // Actualizar el estado con el balance en ETH
    } catch (error) {
      console.error("Error obteniendo el balance:", error);
    }
  };

  const sendFunds = async () => {
    if (!account || !selectedAccount) {
      alert("No hay cuenta conectada o seleccionada.");
      return;
    }

    if (currentNetwork !== parseInt(networkId)) {
      alert("Por favor, conéctate a la red correspondiente en MetaMask.");
      return;
    }

    if (amount <= 0) {
      alert("El monto debe ser mayor a 0.");
      return;
    }

    // Verificar balance de la cuenta seleccionada
    const selectedAccountData = availableAccounts.find(
      (acc) => acc.address === selectedAccount
    );
    if (!selectedAccountData || selectedAccountData.balance < amount) {
      alert("La cuenta seleccionada no tiene suficientes fondos.");
      return;
    }

    try {
      const ethereum = (window as any).ethereum;
      const provider = new ethers.BrowserProvider(ethereum); // Actualizado para ethers v6
      const signer = await provider.getSigner();

      const txResponse = await signer.sendTransaction({
        to: selectedAccount, // Cuenta seleccionada de la red
        value: ethers.parseEther(amount.toString()), // Monto a transferir
      });

      const txReceipt = await txResponse.wait();
      setTx(txReceipt);
      alert("Transacción enviada exitosamente.");
    } catch (error) {
      console.error("Error al enviar fondos:", error);
      alert("Error al enviar fondos. Por favor, revisa la consola para más detalles.");
    }
  };

  return (
    <div className="faucet-modal">
      <button className="close-menu-button" onClick={onClose}>
        X
      </button>
      <h2>Faucet</h2>

      {!account ? (
        <p>Por favor, conecta tu cuenta MetaMask.</p>
      ) : (
        <div>
          <p>
            <strong>Cuenta conectada en MetaMask:</strong> {account}
          </p>
          <p>
            <strong>Red conectada:</strong>{" "}
            {currentNetwork ? `Chain ID ${currentNetwork}` : "Desconocida"}
          </p>
          <p>
            <strong>Balance de la cuenta conectada:</strong>{" "}
            {connectedBalance !== null ? `${connectedBalance} ETH` : "Cargando..."}
          </p>

          <label htmlFor="account-select">Selecciona una cuenta de la red:</label>
          <select
            id="account-select"
            onChange={(e) => setSelectedAccount(e.target.value)}
            value={selectedAccount || ""}
          >
            <option value="" disabled>
              Selecciona una cuenta
            </option>
            {availableAccounts.map((acc) => (
              <option key={acc.address} value={acc.address}>
                {acc.address} - {acc.balance} ETH
              </option>
            ))}
          </select>

          {selectedAccount && (
            <>
              <label htmlFor="amount">Cantidad a transferir (ETH):</label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isNaN(value) || value < 0) {
                    alert("Por favor, ingresa un valor válido.");
                    return;
                  }
                  setAmount(value);
                }}
              />
              <button className="faucet-send-button" onClick={sendFunds}>
                Transferir
              </button>
            </>
          )}
        </div>
      )}

      {tx && (
        <div>
          <p>Detalles de la Transacción:</p>
          <pre>{JSON.stringify(tx, null, 4)}</pre>
        </div>
      )}
    </div>
  );
};

export default Faucet;
