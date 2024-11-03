// src/components/Bloques.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Bloques: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [block, setBlock] = useState<any | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/blocks/${id}`)
      .then((response) => response.json())
      .then((data) => setBlock(data))
      .catch((error) => console.error("Error fetching block data:", error));
  }, [id]);

  return <pre>{block ? JSON.stringify(block, null, 4) : "Loading block data..."}</pre>;
};

export default Bloques;
