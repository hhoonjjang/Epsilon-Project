const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();
const { API_URI, PRIVATE_KEY, MNEMONIC, API_KEY } = process.env;
console.log(API_URI);
console.log(PRIVATE_KEY);
module.exports = {
    development: {
        host: '127.0.0.1', // Localhost (default: none)
        port: 8545, // Standard Ethereum port (default: none)
        network_id: '*', // Any network (default: none)
    },
    networks: {
        polygon_testnet: {
            provider: () => new HDWalletProvider(PRIVATE_KEY.toString(), API_URI),
            network_id: 80001,
        },
    },
    compilers: {
        solc: {
            version: '0.8.19', // Fetch exact version from solc-bin (default: truffle's version)
        },
    },
};
