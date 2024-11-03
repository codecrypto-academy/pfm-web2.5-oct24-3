// src/components/IsAlive.tsx
import React, { useEffect, useState } from "react";

interface IsAliveProps {
  id: string;
}

const IsAlive: React.FC<IsAliveProps> = ({ id }) => {
  const [isAlive, setIsAlive] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3000/isAlive/${id}`);
        const data = await response.json();
        setIsAlive(data?.blockNumber ? true : false);
      } catch (error) {
        console.error("Error checking network status:", error);
        setIsAlive(false);
      }
    };

    checkStatus();
    const intervalId = setInterval(checkStatus, 5000); // Actualiza cada 5 segundos
    return () => clearInterval(intervalId);
  }, [id]);

  return (
    <span className={isAlive ? "text-success" : "text-danger"}>
      {isAlive ? "UP" : "DOWN"}
    </span>
  );
};

export default IsAlive;
