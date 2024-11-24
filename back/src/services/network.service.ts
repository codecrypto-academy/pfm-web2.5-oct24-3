import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { Network } from '../models/network.model';
import { NetworkAlreadyExistsError, NetworkNotFoundError, NetworkSaveError, NoFileExistsError } from '../errors/customErrors';

const DIR_BASE = path.join(__dirname, '..', '..', 'datos');
const DIR_NETWORKS = path.join(DIR_BASE, 'networks');
const FILE_PATH_NETWORKS = path.join(DIR_BASE, 'networks.json');

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

    private async existingDir(dir: string): Promise<boolean> {

        try {

            return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory();

        } catch (error) {
            console.error('Error al verificar el directorio', error)
            return false;
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

    public async deleteNetworkById(networkId: Network["id"]) {

        const pathDirNetwork = path.join(DIR_NETWORKS, networkId);

        if (await this.existingDir(pathDirNetwork)) {

            // Borramos contenedores de Docker
            const dockerComposePath = path.join(pathDirNetwork, 'docker-compose.yml');
            execSync(`docker-compose -f ${dockerComposePath} down`);

            // Borramos directorio de la red
            fs.rmdirSync(pathDirNetwork, { recursive: true });
        }

        // Borramos la red de network.json
        const networkList = await this.readNetworksFromFile();
        const networksDBUpdated = networkList.filter(net => net.id !== networkId);
        await this.writeNetworkToFile(networksDBUpdated);
    }

}