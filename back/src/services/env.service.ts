import fs from 'fs';
import path from "path";
import { Network } from "../models/network.model";

export class EnvService {

    public static async creaEnv(pathDirNetwork: string, network: Network): Promise<void> {
        let bootnode =
            `enode://${fs.readFileSync(`${pathDirNetwork}/bootnode`).toString()}@${network.ipBootnode}:0?discport=30301`
        bootnode = bootnode.replace('\n', '')
        const file =
            `
    BOOTNODE=${bootnode}
    SUBNET=${network.subnet}
    IPBOOTNODE=${network.ipBootnode}
    ETHERBASE=${fs.readFileSync(`${pathDirNetwork}/address.txt`).toString().trim()}
    UNLOCK=${fs.readFileSync(`${pathDirNetwork}/address.txt`).toString().trim()}
    `
        fs.writeFileSync(path.join(pathDirNetwork, '.env'), file);
    }
}