import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import { execSync } from 'child_process';
import { creaContraseña, existeDir, existeNetwork } from './utils/utils';
import { createNodoMiner, createNodoNormal, createNodoRpc } from './utils/nodos';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3333;

const DIR_BASE = path.join(__dirname, '..', 'datos');
const DIR_NETWORKS = path.join(DIR_BASE, 'networks');

function creaDirectorioNetwork(pathNetwork: string) {

    if (existeDir(pathNetwork)) {
        fs.rmSync(pathNetwork, { recursive: true })
    }

    fs.mkdirSync(pathNetwork, { recursive: true })

    fs.writeFileSync(path.join(pathNetwork, 'password.txt'), creaContraseña());
}

function creaCuentaBootnode(pathNetwork: string, network: any) {

    const cmd = `docker run --rm -e IP="@172.16.238.20:0?discport=30301" -v ${pathNetwork}:/root ethereum/client-go:alltools-v1.13.15 sh -c "geth account new --password /root/password.txt --datadir /root | grep 'of the key' | cut -c30- > /root/address.txt &&  bootnode -genkey /root/bootnode.key -writeaddress > /root/bootnode"`;

    execSync(cmd);

    network.alloc.push(fs.readFileSync(path.join(pathNetwork, 'address.txt')).toString().trim())
}

function creaGenesis(pathNetwork: string, network: any) {

    let genesisTemplate = JSON.parse(fs.readFileSync(path.join(DIR_BASE, 'templates', 'genesis_template.json'), 'utf8'));

    genesisTemplate.config.chainId = parseInt(network.chainId);

    genesisTemplate.alloc = network.alloc.reduce((acc: { [x: string]: { balance: string; }; }, i: string) => {
        const cuenta = i.substring(0, 2) == '0x' ? i.substring(2) : i;
        acc[cuenta] = { balance: "400000000" }
        return acc;
    }, {});

    let cuenta = fs.readFileSync(path.join(pathNetwork, 'address.txt')).toString()
    cuenta = cuenta.substring(0, 2) == '0x' ? cuenta.substring(2) : cuenta;

    genesisTemplate.extradata = "0x" + "0".repeat(64) + cuenta.trim() + "0".repeat(130);

    fs.writeFileSync(path.join(pathNetwork, 'genesis.json'), JSON.stringify(genesisTemplate, null, 4));
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

        const network = networksDB.find((i: any) => i.id == id);

        creaDirectorioNetwork(pathNetwork);

        creaCuentaBootnode(pathNetwork, network);

        creaGenesis(pathNetwork, network);

        fs.writeFileSync(path.join(DIR_BASE, 'networks.json'), JSON.stringify(networksDB, null, 4));

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
























//Peticion Get
app.get('/:p1/:p2/:p3', (req: Request, res: Response) => {
    const { p1, p2, p3 } = req.params
    res.send(
        { p1, p2, p3 }
    )
});

//Peticion Post
app.post('/', (req: Request, res: Response) => {
    const body = req.body
    res.send(
        body
    );
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})