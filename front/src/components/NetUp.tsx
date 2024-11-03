// src/components/NetUp.tsx
import React from "react";
import { useParams } from "react-router-dom";

const NetUp: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const startNetwork = async () => {
    try {
      const response = await fetch(`http://localhost:3000/up/${id}`);
      const data = await response.json();
      console.log("Network started:", data);
    } catch (error) {
      console.error("Error starting network:", error);
    }
  };

  return (
    <div>
      <h4>NetUp</h4>
      <p>Para iniciar la red, presiona el botón:</p>
      <button onClick={startNetwork}>Up</button>
    </div>
  );
};

export default NetUp;
