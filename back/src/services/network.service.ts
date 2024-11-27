import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { Network } from '../models/network.model';
import { NetworkAlreadyExistsError, NetworkNotFoundError, NetworkSaveError, NoFileExistsError } from '../errors/customErrors';
import { ethers } from 'ethers';
import { creaContraseña } from '../utils/utils';
import { DockerService } from './docker.service';
import { EnvService } from './env.service';

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

    private async creaDirectorioNetwork(pathDirNetwork: string): Promise<void> {

        if (await this.existingDir(pathDirNetwork)) {
            fs.rmSync(pathDirNetwork, { recursive: true });
        }

        fs.mkdirSync(pathDirNetwork, { recursive: true });
        fs.writeFileSync(path.join(pathDirNetwork, 'password.txt'), creaContraseña());
    }

    private async creaGenesis(pathDirNetwork: string, network: Network): Promise<void> {

        let genesisTemplate = JSON.parse(fs.readFileSync(path.join(DIR_BASE, 'templates', 'genesis_template.json'), 'utf8'));

        genesisTemplate.config.chainId = network.chainId;

        genesisTemplate.alloc = network.alloc.reduce((acc: { [x: string]: { balance: string; }; }, i: string) => {
            const cuenta = i;
            acc[cuenta] = { balance: "20000000000000000000000" }
            return acc;
        }, {});

        let cuenta = fs.readFileSync(path.join(pathDirNetwork, 'address.txt')).toString()
        cuenta = cuenta.substring(0, 2) == '0x' ? cuenta.substring(2) : cuenta;

        genesisTemplate.extradata = "0x" + "0".repeat(64) + cuenta.trim() + "0".repeat(130);

        fs.writeFileSync(path.join(pathDirNetwork, 'genesis.json'), JSON.stringify(genesisTemplate, null, 4));
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

    public async upNetworkById(networkId: Network["id"]): Promise<void> {

        const networkDB = await this.readNetworksFromFile();

        if (await this.getNetworkById(networkId)) {

            const pathDirNetwork = path.join(DIR_NETWORKS, networkId);

            if (!(await this.existingDir(pathDirNetwork) &&
                fs.existsSync(path.join(pathDirNetwork, "docker-compose.yml")))) {

                const network = networkDB.find(net => net.id === networkId) as Network;

                await this.creaDirectorioNetwork(pathDirNetwork);

                await DockerService.creaCuentaBootnode(pathDirNetwork, network);

                await this.creaGenesis(pathDirNetwork, network);

                DockerService.creaDockerCompose(pathDirNetwork, network);

                await EnvService.creaEnv(pathDirNetwork, network);
            }

            const dockerComposePath = path.join(pathDirNetwork, 'docker-compose.yml');
            console.log(`docker-compose -f ${dockerComposePath} up -d`);
            execSync(`docker-compose -f ${dockerComposePath} up -d`);
            console.log('EJECUTADO');
        }
    }

    public async downNetworkById(networkId: Network["id"]): Promise<void> {

        const pathDirNetwork = path.join(DIR_NETWORKS, networkId);
        const dockerComposePath = path.join(pathDirNetwork, 'docker-compose.yml');

        if (await this.existingDir(pathDirNetwork) && fs.existsSync(dockerComposePath)) {
            // Borramos contenedores de Docker
            execSync(`docker-compose -f ${dockerComposePath} down`);
        }
    }

    public async restartNetworkById(networkId: Network["id"]): Promise<void> {

        const pathDirNetwork = path.join(DIR_NETWORKS, networkId);
        const dockerComposePath = path.join(pathDirNetwork, 'docker-compose.yml');

        if (await this.existingDir(pathDirNetwork) && fs.existsSync(dockerComposePath)) {
            // Borramos contenedores de Docker
            execSync(`docker-compose -f ${dockerComposePath} restart`);
        }
    }

    public async deleteNetworkById(networkId: Network["id"]): Promise<void> {

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

    public async lastBlockNetwordById(networkId: Network["id"]) {
        
        const networksDB = await this.readNetworksFromFile();

        if (await this.getNetworkById(networkId)) {
            
            const network = await this.getNetworkById(networkId);
            const port = network.nodos.find(i => i.type == 'rpc')?.port
            
            // creamos el provider 
            const provider = new ethers.JsonRpcProvider(`http://localhost:${port}`);
            const blockNumber = await provider.getBlockNumber();
            
            let promises = [];
            
            for (let i = blockNumber - 10; i < blockNumber; i++) {
                promises.push(provider.getBlock(i));
            }

            const blocks = await Promise.all(promises);
            
            return blocks;
        }
    }
};