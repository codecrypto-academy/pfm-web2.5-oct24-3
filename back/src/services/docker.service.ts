import fs from 'fs';
import path from "path";
import { execSync } from "child_process";
import { Network } from "../models/network.model";
import { Nodo } from '../models/nodo.model';

export class DockerService {

    private static createBootnode() {
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

    private static createNodoMiner(nodo: Nodo) {
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

    private static createNodoRpc(nodo: Nodo) {
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

    private static createNodoNormal(nodo: Nodo) {
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

    private static createNodo(nodo: Nodo) {
        switch (nodo.type) {
            case "miner":
                return this.createNodoMiner(nodo)
            case "rpc":
                return this.createNodoRpc(nodo)
            case "normal":
                return this.createNodoNormal(nodo)
        }

    }

    public static async creaCuentaBootnode(pathDirNetwork: string, network: Network): Promise<void> {

        const cmd = `docker run --rm -e IP="@172.16.238.20:0?discport=30301" -v ${pathDirNetwork}:/root ethereum/client-go:alltools-v1.13.15 sh -c "geth account new --password /root/password.txt --datadir /root | grep 'of the key' | cut -c30- > /root/address.txt &&  bootnode -genkey /root/bootnode.key -writeaddress > /root/bootnode"`;

        execSync(cmd);

        network.alloc.push(fs.readFileSync(path.join(pathDirNetwork, 'address.txt')).toString().trim());
    }


    public static async creaDockerCompose(pathDirNetwork: string, network: Network): Promise<void> {

        const dockerCompose =
        `
services:
${this.createBootnode()}
${network.nodos.map(nodo => this.createNodo(nodo)).join('\n')}
networks:
  ethnetwork:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: \${SUBNET}

`
        fs.writeFileSync(path.join(pathDirNetwork, 'docker-compose.yml'), dockerCompose);
    }
}