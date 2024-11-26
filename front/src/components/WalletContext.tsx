import React, { createContext, useState, useContext, ReactNode } from "react";

interface WalletContextProps {
  walletAddress: string | null;
  setWalletAddress: React.Dispatch<React.SetStateAction<string | null>>;
}

// Crea el contexto
export const WalletContext = createContext<WalletContextProps | undefined>(undefined);

// Crea un proveedor para el contexto
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook para usar el contexto de la billetera
export const useWalletContext = (): WalletContextProps => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext debe usarse dentro de un WalletProvider");
  }
  return context;
};
