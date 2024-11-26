import { Router } from 'express';
import { NetworkController } from '../controllers/network.controller';

const networkRoutes = Router();

// EndPoint para obtener todas las Networks
networkRoutes.get("/", NetworkController.getAllNetworks);

// EndPoint para obtener una Network
networkRoutes.get("/:id", NetworkController.getNetworkById);

// EndPoint para crear Network
networkRoutes.post("/", NetworkController.createNetwork);

// EndPoint para levantar Network
networkRoutes.get("/up/:id", NetworkController.upNetwork);

// EndPoint para bajar Network
networkRoutes.get("/down/:id", NetworkController.downNetwork);

// EndPoint para borrar una Network
networkRoutes.delete("/:id", NetworkController.deleteNetwork);

// EndPoint para consultar10UltimosBloques de una Network
networkRoutes.get('/block/:id', NetworkController.getLastBlocksNetwork)


export default networkRoutes;
