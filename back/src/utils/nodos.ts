export function createNodoMiner(nodo: any) {
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

export function createNodoRpc(nodo: any) {
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

export function createNodoNormal(nodo: any) {
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