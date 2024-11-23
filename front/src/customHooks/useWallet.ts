import { useState } from "react";
import { ethers } from "ethers";

const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask no está instalada. Por favor, instálala para continuar.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum); // Usar ethers para interactuar con la wallet
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]); // Guardar la primera cuenta
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error al conectar la wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
  };

  return {
    walletAddress,
    isConnected,
    connectWallet,
    disconnectWallet,
  };
};

export default useWallet;
