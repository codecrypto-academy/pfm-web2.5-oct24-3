import path from 'path';
import fs from 'fs';
import { Network } from '../models/network.model';
import { NetworkAlreadyExistsError, NetworkNotFoundError, NetworkSaveError, NoFileExistsError } from '../errors/customErrors';

const FILE_PATH_NETWORKS = path.join(__dirname, '..', '..', 'datos', 'networks.json');

export class NetworkService {

    private async readNetworksFromFile(): Promise<Network[]> {

        try {

            const data = fs.readFileSync(FILE_PATH_NETWORKS, "utf-8");

            return JSON.parse(data) as Network[];

        } catch (error: any) {

            if (error.code === "ENOENT") {
                fs.writeFileSync(FILE_PATH_NETWORKS, JSON.stringify([]));
                return [];
            }

            throw new NoFileExistsError();
        }
    }

    private async writeNetworkToFile(network: Network[]): Promise<void> {

        try {

            const data = JSON.stringify(network, null, 4);
            fs.writeFileSync(FILE_PATH_NETWORKS, data);

        } catch (error) {
            throw new NetworkSaveError();
        }
    }

    public async getAllNetworks(): Promise<Network[]> {
        return await this.readNetworksFromFile();
    }

    public async getNetworkById(networkId: Network["id"]): Promise<Network> {

        const network = (await this.readNetworksFromFile()).find(net => net.id === networkId);

        if (network) {
            return network;
        } else {
            throw new NetworkNotFoundError();
        }
    }

    public async saveNetwork(network: Network): Promise<Network> {

        const networkList = await this.readNetworksFromFile();

        const existingNetwork = networkList.find(net => net.id === network.id || net.chainId === network.chainId);

        if (existingNetwork) {
            throw new NetworkAlreadyExistsError();
        }

        networkList.push(network);

        await this.writeNetworkToFile(networkList);

        return network;
    }

}