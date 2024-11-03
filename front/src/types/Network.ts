// src/types/Network.ts

export interface Nodo {
    type: string;
    name: string;
    ip: string;
    port: number;
  }
  
  export interface Network {
    id: string;
    chainId: number;
    subnet: string;
    ipBootnode: string;
    alloc: string[];
    nodos: Nodo[];
  }
  