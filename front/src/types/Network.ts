export interface Alloc {
  address: string; // Dirección Ethereum
  balance: number; // Saldo asignado
}

export interface Nodo {
  type: string;
  name: string;
  ip: string;
  port?: number;
}

export interface Network {
  id: string;
  chainId: string; // Cambiado a string según el proyecto
  subnet: string;
  ipBootnode: string;
  alloc: Alloc[]; // Array de objetos Alloc
  nodos: Nodo[]; // Array de nodos
  isUp?: boolean; // Estado opcional
}
