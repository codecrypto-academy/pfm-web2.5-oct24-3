import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import { execSync } from 'child_process';

const app = express();
app.use(express.json());
app.use(cors());

const port = 3333;

const DIR_BASE = path.join(__dirname, '..', 'datos');
const DIR_NETWORKS = path.join(DIR_BASE, 'networks');

function existeNetwork(id: string, networksDB: any): boolean {
    const network = networksDB.find((i: { id: string; }) => i.id == id);
    return !!network;
}

function creaContraseña(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < 15; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        resultado += caracteres[indiceAleatorio];
    }
    return resultado;
}

function existeDir(dir: string): boolean {
    try {
        return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory();
    } catch (error) {
        console.error('Error al verificar el directorio', error);
        return false;
    }
}

function creaDirectorioNetwork(pathNetwork: string) {
    if (existeDir(pathNetwork)) {
        fs.rmSync(pathNetwork, { recursive: true });
    }
    fs.mkdirSync(pathNetwork, { recursive: true });
    fs.writeFileSync(path.join(pathNetwork, 'password.txt'), creaContraseña());
}

function creaCuentaBootnode(pathNetwork: string) {
    const cmd = `docker run --rm -e IP="@172.16.238.20:0?discport=30301" -v ${pathNetwork}:/root ethereum/client-go:alltools-v1.13.15 sh -c "geth account new --password /root/password.txt --datadir /root | grep 'of the key' | cut -c30- > /root/address.txt &&  bootnode -genkey /root/bootnode.key -writeaddress > /root/bootnode"`;
    execSync(cmd);
}

function creaGenesis(pathNetwork: string, network: any) {
    let genesisBase = {
        "config": {
            "chainId": parseInt(network.chainId),
            "homesteadBlock": 0,
            "eip150Block": 0,
            "eip155Block": 0,
            "eip158Block": 0,
            "byzantiumBlock": 0,
            "constantinopleBlock": 0,
            "petersburgBlock": 0,
            "clique": {
                "period": 30,
                "epoch": 30000
            }
        },
        "difficulty": "1",
        "gasLimit": "8000000",
        "extradata": "",
        "alloc": {}
    };

    network.alloc.push(fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim());
    genesisBase.alloc = network.alloc.reduce((acc: { [x: string]: { balance: string; }; }, i: string) => {
        const cuenta = i.substring(0, 2) === '0x' ? i.substring(2) : i;
        acc[cuenta] = { balance: "400000000" };
        return acc;
    }, {});

    let cuenta = fs.readFileSync(`${pathNetwork}/address.txt`).toString();
    cuenta = cuenta.substring(0, 2) === '0x' ? cuenta.substring(2) : cuenta;

    genesisBase.extradata = "0x" + "0".repeat(64) + cuenta.trim() + "0".repeat(130);

    fs.writeFileSync(path.join(pathNetwork, 'genesis.json'), JSON.stringify(genesisBase, null, 4));

    return genesisBase;
}

function createBootnode(network: any) {
    return `
    geth-bootnode:
        hostname: geth-bootnode
        image: ethereum/client-go:alltools-v1.13.15
        command: 'bootnode     --addr \${IPBOOTNODE}:30301 
            --netrestrict=\${SUBNET} 
            --nodekey=/pepe/bootnode.key'
        volumes:
        - ./bootnode.key:/pepe/bootnode.key
        networks:
            ethnetwork:
                ipv4_address: \${IPBOOTNODE}`;
}

function createNodoMiner(nodo: any) {
    return `
    ${nodo.name}:
        image: ethereum/client-go:v1.13.15
        volumes:
            - ./${nodo.name}:/root/.ethereum
            - ./genesis.json:/root/genesis.json
            - ./password.txt:/root/.ethereum/password.sec
            - ./keystore:/root/.ethereum/keystore
        depends_on:
            - geth-bootnode
        networks:
            ethnetwork:
                ipv4_address: ${nodo.ip}
        entrypoint: sh -c 'geth init 
            /root/genesis.json && geth   
            --nat "extip:${nodo.ip}"
            --netrestrict=\${SUBNET} 
            --bootnodes="\${BOOTNODE}"
            --miner.etherbase \${ETHERBASE}   
            --mine  
            --unlock \${UNLOCK}
            --password /root/.ethereum/password.sec'`;
}

function createNodoRpc(nodo: any) {
    return `
    ${nodo.name}:
        image: ethereum/client-go:v1.13.15
        volumes:
            - ./${nodo.name}:/root/.ethereum
            - ./genesis.json:/root/genesis.json
        depends_on:
             - geth-bootnode
        networks:
            ethnetwork:
                    ipv4_address: ${nodo.ip}
        ports:
            - "${nodo.port}:8545"
        entrypoint: sh -c 'geth init 
            /root/genesis.json && geth     
            --netrestrict=\${SUBNET}    
            --bootnodes="\${BOOTNODE}"
            --nat "extip:${nodo.ip}"
            --http 
            --http.addr "0.0.0.0" 
            --http.port 8545
            --http.corsdomain "*" 
            --http.api "admin,eth,debug,miner,net,txpool,personal,web3"'`;
}

// Nuevo endpoint para obtener las redes
app.get('/networks', (req: Request, res: Response) => {
    try {
        const networksPath = path.join(DIR_BASE, 'networks.json');
        const networksData = JSON.parse(fs.readFileSync(networksPath, 'utf-8'));
        res.status(200).json(networksData);
    } catch (error) {
        console.error('Error al obtener redes:', error);
        res.status(500).json({ error: 'Error al obtener las redes.' });
    }
});

// Endpoint existente: ejemplo genérico
app.get('/:p1/:p2/:p3', (req: Request, res: Response) => {
    const { p1, p2, p3 } = req.params;
    res.send({ p1, p2, p3 });
});

// Endpoint POST existente
app.post('/', (req: Request, res: Response) => {
    const body = req.body;
    res.send(body);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
