// src/components/NetDown.tsx
import React from "react";
import { useParams } from "react-router-dom";

const NetDown: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const stopNetwork = async () => {
    try {
      const response = await fetch(`http://localhost:3000/down/${id}`);
      const data = await response.json();
      console.log("Network stopped:", data);
    } catch (error) {
      console.error("Error stopping network:", error);
    }
  };

  return (
    <div>
      <h4>NetDown</h4>
      <p>Para detener la red, presiona el botón:</p>
      <button onClick={stopNetwork}>Down</button>
    </div>
  );
};

export default NetDown;
