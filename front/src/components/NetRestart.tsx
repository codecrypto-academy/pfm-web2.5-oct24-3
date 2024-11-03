// src/components/NetRestart.tsx
import React from "react";
import { useParams } from "react-router-dom";

const NetRestart: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const restartNetwork = async () => {
    try {
      const response = await fetch(`http://localhost:3000/restart/${id}`, {
        method: "POST",
      });
      const result = await response.json();
      console.log("Network restarted:", result);
    } catch (error) {
      console.error("Error restarting network:", error);
    }
  };

  return (
    <div>
      <h1>Net Restart</h1>
      <p>To restart the network, press the button below:</p>
      <button onClick={restartNetwork}>Restart Network</button>
    </div>
  );
};

export default NetRestart;
