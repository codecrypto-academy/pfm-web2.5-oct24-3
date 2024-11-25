import { NextFunction, Request, Response } from 'express';
import { Network, networkSchema } from '../models/network.model';
import { NetworkService } from '../services/network.service';

const networkService = new NetworkService();

export class NetworkController {

    public static async getAllNetworks(req: Request, res: Response, next: NextFunction) {

        try {

            const networkList = await networkService.getAllNetworks();

            res.status(200).json({
                status: "success",
                data: {networkList: networkList}
            });

        } catch (error) {
            next(error);
        }
    }

    public static async getNetworkById(req: Request, res: Response, next: NextFunction) {

        try {

            const { id } = req.params;

            const network = await networkService.getNetworkById(id);

            res.status(200).json({
                status: "success",
                data: {network: network}
            });

        } catch (error) {
            next(error);
        }
    }

    public static async createNetwork(req: Request, res: Response, next: NextFunction) {

        try {

            const validateNetwork: Network = networkSchema.parse(req.body);

            const savedNetwork = await networkService.saveNetwork(validateNetwork);

            res.status(201).json({
                status: "success",
                data: {network: savedNetwork}
            });

        } catch (error) {
            next(error);
        }
    }

    public static async deleteNetwork(req: Request, res: Response, next: NextFunction) {

        try {

            const { id } = req.params;

            await networkService.deleteNetworkById(id);

            res.status(204).send();

        } catch (error) {
            next(error);
        }
    }
    
    public static async lastBlockNetwork (req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await networkService.UltimosBloquesRedById(id)
            res.send(blocks);

    
            // Obtener el puerto RPC
            const port = network.nodos.find((node: any) => node.type === 'rpc')?.PORT;
            if (!port) {
                throw new NotFoundError('No se encontró el puerto RPC para la red.');
            }
    
            // Obtener los bloques de la red
            const blocks = await obtenerBloques(port);
    
            // Enviar los bloques como respuesta
            res.send(blocks);
        } catch (error) {
            next(error);
        }
    }
}