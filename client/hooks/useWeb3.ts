import { useCallback, useEffect, useState } from 'react';
import Web3 from 'web3';

export const useWeb3 = (): {
    web3?: Web3;
    account?: string;
    chainId: string | null;
    logIn: () => void;
    getBalance: () => Promise<string | undefined>;
    balance: string;
} => {
    const [web3, setWeb3] = useState<Web3 | undefined>();
    const [account, setAccount] = useState<string | undefined>('');
    const [chainId, setChainId] = useState<string | null>('');
    const [balance, setBalance] = useState('');

    const logIn = useCallback(async () => {
        try {
            if (window.ethereum) {
                const _web3: Web3 = new Web3(window.ethereum);
                setWeb3(_web3);

                const [_account] = (await window.ethereum.request({
                    method: 'eth_requestAccounts',
                })) as Array<string>;
                if (_account) {
                    setAccount(_account);
                }

                window.ethereum.on('accountsChanged', async () => {
                    if (window.ethereum) {
                        const [_account] = (await window.ethereum.request({
                            method: 'eth_requestAccounts',
                        })) as Array<string>;
                        setAccount(_account);
                    }
                });

                setChainId(window.ethereum.networkVersion);
            } else {
                console.log('MetaMask is not exist');
                setAccount(undefined);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);
    const getBalance = useCallback(async () => {
        if (web3 && account) {
            try {
                const _balance = await web3.eth.getBalance(account);
                setBalance(web3.utils.fromWei(_balance));
                return web3.utils.fromWei(_balance);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log('Web3 or account is not exist');
        }
        return undefined;
    }, [web3, account]);

    return { web3, account, chainId, logIn, getBalance, balance };
};
