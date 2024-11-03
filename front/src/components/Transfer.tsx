// src/components/Transfer.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";

type TransferFormInputs = {
  address: string;
  amount: number;
};

const Transfer: React.FC = () => {
  const { register, handleSubmit } = useForm<TransferFormInputs>({
    defaultValues: {
      address: "0x17752fF2C194085ffbaA59EA128Fd4bdacd91193",
      amount: 0.1,
    },
  });
  const [account, setAccount] = useState<string | null>(null);
  const [tx, setTx] = useState<any | null>(null);

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts: string[]) => {
          setAccount(accounts[0]);
        });
    }
  }, []);

  const onSubmit = async (data: TransferFormInputs) => {
    if (!account) return;
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        from: account,
        to: data.address,
        value: ethers.parseEther(data.amount.toString()),
        gasLimit: 21000,
      });
      const receipt = await tx.wait();
      setTx(receipt);
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <div>
      <h1>Transfer</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Address</label>
          <input {...register("address")} placeholder="Recipient address" />
        </div>
        <div>
          <label>Amount</label>
          <input type="number" {...register("amount")} placeholder="Amount in ETH" />
        </div>
        <button type="submit">Send</button>
      </form>
      {tx && <pre>Transaction: {JSON.stringify(tx, null, 4)}</pre>}
    </div>
  );
};

export default Transfer;
