import { NextFunction, Request, Response } from 'express';
import { Network, networkSchema } from '../models/network.model';
import { NetworkService } from '../services/network.service';

const networkService = new NetworkService();

export class NetworkController {

    public static async getAllNetworks(req: Request, res: Response, next: NextFunction) {

        try {

            const networkList = await networkService.getAllNetworks();

            res.status(200).json({
                networkList: networkList
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
                network: network
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
                message: "Network creada exitosamente",
                network: savedNetwork
            });

        } catch (error) {
            next(error);
        }
    }
}
