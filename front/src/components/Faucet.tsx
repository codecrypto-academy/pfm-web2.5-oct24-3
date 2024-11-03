// src/components/Faucet.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";

const Faucet: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [tx, setTx] = useState<any | null>(null); 
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const ethereum = (window as any).ethereum;

    if (ethereum) {
      ethereum.on("accountsChanged", (accounts: string[]) => {
        console.log(accounts);
        setAccount(accounts[0]);
      });
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts: string[]) => {
          console.log(accounts);
          setAccount(accounts[0]);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }, []);

  async function send(amount: number) {
    if (!account) {
      console.log("No account connected");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/faucet/${id}/${account}/${amount}`);
      const data = await response.json();
      setTx(data);
    } catch (error) {
      console.error("Error fetching from faucet:", error);
    }
  }

  return (
    <div>
      <h1>Faucet</h1>
      <div>
        {account ? <p>Account: {account}</p> : <p>Account: No hay cuenta</p>}
        <p>Cantidad solicitada: 0.1 ETH</p>
        <button className="btn btn-primary" onClick={() => send(0.1)}>
          Solicitar
        </button>
        <div>
          {tx ? (
            <pre>Transaction: {JSON.stringify(tx, null, 4)}</pre>
          ) : (
            <p>Transaction: No hay transacción</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Faucet;
