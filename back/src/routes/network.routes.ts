import { Router } from 'express';
import { NetworkController } from '../controllers/network.controller';

const networkRoutes = Router();

// EndPoint para obtener todos las Networks
networkRoutes.get("/", NetworkController.getAllNetworks);

// EndPoint para obtener todos las Networks
networkRoutes.get("/:id", NetworkController.getNetworkById);

// EndPoint para crear Network
networkRoutes.post("/", NetworkController.createNetwork);

export default networkRoutes;
