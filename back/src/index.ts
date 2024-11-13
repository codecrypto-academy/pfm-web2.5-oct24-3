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

    if (network) {
        return true;
    } else {
        return false;
    }

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
        console.error('Error al verificar el directorio', error)
        return false;
    }
}

function creaDirectorioNetwork(pathNetwork: string) {

    if (existeDir(pathNetwork)) {
        fs.rmSync(pathNetwork, { recursive: true })
    }

    fs.mkdirSync(pathNetwork, { recursive: true })

    fs.writeFileSync(path.join(pathNetwork, 'password.txt'), creaContraseña());
}

function creaCuentaBootnode(pathNetwork: string) {
    const cmd = `docker run --rm -e IP="@172.16.238.20:0?discport=30301" -v ${pathNetwork}:/root ethereum/client-go:alltools-v1.13.15 sh -c "geth account new --password /root/password.txt --datadir /root | grep 'of the key' | cut -c30- > /root/address.txt &&  bootnode -genkey /root/bootnode.key -writeaddress > /root/bootnode"`

    execSync(cmd)
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
        "extradata": "0x0000000000000000000000000000000000000000000000000000000000000000afa85efee702f0d000fab26459646f41f52970969d774d8ca6d1bfda24f5fd49fe3656d0b6e8d663245f57be3edfe70dd851774c610f3d34e656ee350000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "alloc": {
            "0x60bdd53647bE24c12374d09F2624ea76BD4D1796": {
                "balance": "400000000"
            }
        }
    };

    network.alloc.push(fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim())
    genesisBase.alloc = network.alloc.reduce((acc: { [x: string]: { balance: string; }; }, i: string) => {
        const cuenta = i.substring(0, 2) == '0x' ? i.substring(2) : i;
        acc[cuenta] = { balance: "400000000" }
        return acc;
    }, {});

    let cuenta = fs.readFileSync(`${pathNetwork}/address.txt`).toString()
    cuenta = cuenta.substring(0, 2) == '0x' ? cuenta.substring(2) : cuenta;

    genesisBase.extradata = "0x" + "0".repeat(64) + cuenta.trim() + "0".repeat(130);

    fs.writeFileSync(path.join(pathNetwork, 'genesis.json'), JSON.stringify(genesisBase, null, 4));

    return genesisBase;
}

function createBootnode(network: any) {
    const bootnode = `
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
                ipv4_address: \${IPBOOTNODE} `
    return bootnode;
}

function createNodoMiner(nodo: any) {
    const miner = `
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
            --password /root/.ethereum/password.sec'

`
    return miner;
}

function createNodoRpc(nodo: any) {
    const rpc = `
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
            --http.api "admin,eth,debug,miner,net,txpool,personal,web3"'
    `
    return rpc
}

function createNodoNormal(nodo: any) {
    const n =
        `
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
        entrypoint: sh -c 'geth init 
            /root/genesis.json && geth   
            --bootnodes="\${BOOTNODE}"
            --nat "extip:${nodo.ip}"
            --netrestrict=\${SUBNET}  ' `
    return n;

}

function createNodo(nodo: any) {
    switch (nodo.type) {
        case 'miner':
            return createNodoMiner(nodo)
        case 'rpc':
            return createNodoRpc(nodo)
        case 'normal':
            return createNodoNormal(nodo)
    }

}

function creaDockerCompose(pathNetwork: string, network: any) {
    const dockerCompose =
        `
services:
${createBootnode(network)}
${network.nodos.map((nodo: any) => createNodo(nodo)).join('\n')}
networks:
  ethnetwork:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: \${SUBNET}

`
    fs.writeFileSync(path.join(pathNetwork, 'docker-compose.yml'), dockerCompose);
    return dockerCompose;
}

function creaEnv(pathNetwork: string, network: any) {
    let bootnode =
        `enode://${fs.readFileSync(`${pathNetwork}/bootnode`).toString()}@${network.ipBootnode}:0?discport=30301`
    bootnode = bootnode.replace('\n', '')
    const file =
        `
BOOTNODE=${bootnode}
SUBNET=${network.subnet}
IPBOOTNODE=${network.ipBootnode}
ETHERBASE=${fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim()}
UNLOCK=${fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim()}
`
    fs.writeFileSync(path.join(pathNetwork, '.env'), file);
    return file
}






app.get('/up/:id', async (req: Request, res: Response) => {

    const { id } = req.params;
    const networksDB = JSON.parse(fs.readFileSync(path.join(DIR_BASE, 'networks.json')).toString());

    if (existeNetwork(id, networksDB)) {

        const pathNetwork = path.join(DIR_NETWORKS, id);

        const network = networksDB.find((i: { id: string; }) => i.id == id);

        creaDirectorioNetwork(pathNetwork);

        creaCuentaBootnode(pathNetwork);

        creaGenesis(pathNetwork, network);

        creaDockerCompose(pathNetwork, network);

        creaEnv(pathNetwork, network);

        const dockerComposePath = path.join(pathNetwork, 'docker-compose.yml');
        console.log(`docker-compose -f ${dockerComposePath} up -d`)
        execSync(`docker-compose -f ${dockerComposePath} up -d`);
        console.log(`EJECUTADO`)

        res.status(200).send('ok');

    } else {
        res.status(404).send(`No se ha encontrado la red ${id}`);
    }
});
























//Petición Get 
app.get('/:p1/:p2/:p3', (req: Request, res: Response) => {
    const { p1, p2, p3 } = req.params
    res.send(
        { p1, p2, p3 }
    )
});

//Petición Post
app.post('/', (req: Request, res: Response) => {
    const body = req.body
    res.send(
        body
    );
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
}) 