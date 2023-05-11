import Web3 from 'web3';
export default interface Web3Hook {
    web3: Web3;
    account: string;
    nextworkId: number;
    connected: boolean;
    connect: () => void;
}
