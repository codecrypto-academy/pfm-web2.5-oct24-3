// src/types/Network.ts

export interface Nodo {
  type: string;
  name: string;
  ip: string;
  port: number;
}

export interface Network {
  id: string;
  chainId: string; // Cambiado a string según el proyecto
  subnet: string;
  ipBootnode: string;
  alloc: string[]; // Array de direcciones Ethereum
  nodos: Nodo[]; // Array de nodos
  isUp?: boolean; // Estado opcional
}
