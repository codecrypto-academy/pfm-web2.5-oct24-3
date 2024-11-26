// src/components/NetworkCard.tsx

import React from "react";
import "./networkCard.css";
import basuraIcon from "../assets/basura.svg"; // Asegúrate de que el archivo exista en esta ruta

interface NetworkCardProps {
  name: string;
  status: "UP" | "DOWN";
  onUp: () => void;
  onDown: () => void;
  onRestart: () => void;
  onDelete: () => void; // Callback para manejar la eliminación
}

const NetworkCard: React.FC<NetworkCardProps> = ({
  name,
  status,
  onUp,
  onDown,
  onRestart,
  onDelete,
}) => {
  const handleDelete = () => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar la red "${name}"?`);
    if (confirmDelete) {
      onDelete(); // Llamar al callback de eliminación
    }
  };

  return (
    <div className={`network-card ${status === "UP" ? "network-up" : "network-down"}`}>
      <div className="network-header">
        <h3 className="network-name">{name}</h3>
        {/* Ícono de basura para eliminar la red */}
        <button className="delete-network-button" onClick={handleDelete}>
          <img src={basuraIcon} alt="Eliminar red" />
        </button>
      </div>
      <p className={`network-status ${status === "UP" ? "status-up" : "status-down"}`}>
        {status === "UP" ? "Online" : "Offline"}
      </p>

      <div className="network-actions">
        {status === "DOWN" && (
          <button onClick={onUp} className="action-btn up-btn">
            Up
          </button>
        )}
        {status === "UP" && (
          <>
            <button onClick={onDown} className="action-btn down-btn">
              Down
            </button>
            <button onClick={onRestart} className="action-btn restart-btn">
              Restart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NetworkCard;
