// src/components/NetworkCard.tsx

import React from "react";
import "./networkCard.css";

interface NetworkCardProps {
  name: string;
  status: "UP" | "DOWN";
  onUp: () => void;
  onDown: () => void;
  onRestart: () => void;
}

const NetworkCard: React.FC<NetworkCardProps> = ({ name, status, onUp, onDown, onRestart }) => {
  return (
    <div className={`network-card ${status === "UP" ? "network-up" : "network-down"}`}>
      <h3 className="network-name">{name}</h3>
      <p className={`network-status ${status === "UP" ? "status-up" : "status-down"}`}>
        {status === "UP" ? "Online" : "Offline"}
      </p>
      
      <div className="network-actions">
        {status === "DOWN" && (
          <button onClick={onUp} className="action-btn up-btn">Up</button>
        )}
        {status === "UP" && (
          <>
            <button onClick={onDown} className="action-btn down-btn">Down</button>
            <button onClick={onRestart} className="action-btn restart-btn">Restart</button>
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkCard;
