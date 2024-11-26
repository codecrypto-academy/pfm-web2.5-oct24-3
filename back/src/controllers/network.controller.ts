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
                data: { networkList: networkList }
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
                data: { network: network }
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
                data: { network: savedNetwork }
            });

        } catch (error) {
            next(error);
        }
    }

    public static async upNetwork(req: Request, res: Response, next: NextFunction) {

        try {

            const { id } = req.params;

            await networkService.upNetworkById(id);

            res.status(200).send();

        } catch (error) {
            next(error);
        }
    }

    public static async downNetwork(req: Request, res: Response, next: NextFunction) {

        try {

            const { id } = req.params;

            await networkService.downNetworkById(id);

            res.status(200).send();

        } catch (error) {
            next(error);
        }
    }

    public static async restartNetwork(req: Request, res: Response, next: NextFunction) {

        try {

            const { id } = req.params;

            await networkService.restartNetworkById(id);

            res.status(200).send();

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
    
    public static async getLastBlocksNetwork (req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            await networkService.lastBlockNetwordById(id)
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }
}