import axios from 'axios';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const CurrencyMintCard = ({ web3, account }: { web3: any; account: string }) => {
    const [makeSwapInput, setMakeSwapInput] = useState<number>();
    const [makeStakeInput, setMakeStakeInput] = useState<number>();
    const [makeICOInput, setMakeICOInput] = useState<number>();

    const makeSwapHUT = async (): Promise<any> => {
        const { data } = await axios.post('http://13.125.251.97:8080/api/contract/mintVendor', {
            amount: makeSwapInput,
            account: web3.account,
        });
        console.log('data', data);
        if (web3.web3) {
            const makeHUT = await web3?.web3.eth.sendTransaction(data);

            console.log('makeHUT', makeHUT);
            const txData = {
                amount: makeSwapInput,
                type: 'Token',
                status: 'Success',
                from: makeHUT.from,
                to: makeHUT.to,
                hash: makeHUT.transactionHash,
                saveType: 'mint',
            };
            try {
                const { data } = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', { ...txData });
                return data;
            } catch (error) {
                console.error(error);
                return error;
            }
        }
    };

    const makeStakeHUT = async (): Promise<any> => {
        const { data } = await axios.post('http://13.125.251.97:8080/api/contract/mintStaking', {
            amount: makeStakeInput,
            account: web3.account,
        });
        console.log('data', data);
        if (web3.web3) {
            const makeHUT = await web3?.web3.eth.sendTransaction(data);

            console.log('makeHUT', makeHUT);
            const txData = {
                amount: makeStakeInput,
                type: 'Token',
                status: 'Success',
                from: makeHUT.from,
                to: makeHUT.to,
                hash: makeHUT.transactionHash,
                saveType: 'mint',
            };
            try {
                const { data } = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', { ...txData });
                return data;
            } catch (error) {
                console.error(error);
                return error;
            }
        }
    };

    const makeICOHUT = async (): Promise<any> => {
        const { data } = await axios.post('http://13.125.251.97:8080/api/contract/mintICO', {
            amount: makeICOInput,
            account: web3.account,
        });
        console.log('data', data);
        if (web3.web3) {
            const makeHUT = await web3?.web3.eth.sendTransaction(data);

            console.log('makeHUT', makeHUT);
            const txData = {
                amount: makeICOInput,
                type: 'Token',
                status: 'Success',
                from: makeHUT.from,
                to: makeHUT.to,
                hash: makeHUT.transactionHash,
                saveType: 'mint',
            };
            try {
                const { data } = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', { ...txData });
                return data;
            } catch (error) {
                console.error(error);
                return error;
            }
        }
    };

    useEffect(() => {
        console.log(makeICOInput);
    }, [makeICOInput]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'wrap',
                '& > :not(style)': {
                    m: 1,
                },
            }}
        >
            <Paper
                className={'header'}
                sx={{
                    width: '100%',
                    marginBottom: '50px',
                    padding: '20px 0',
                    fontSize: '1.5rem',
                    pl: '20px',
                }}
            >
                Mint Currency
            </Paper>

            <Tooltip title={'현재 모인 금액'} arrow placement={'top'}>
                <Paper
                    elevation={3}
                    sx={{
                        justifyContent: 'space-between',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        pl: '15px',
                        padding: '40px 20px',
                    }}
                >
                    <TextField
                        id="outlined-basic"
                        label="Swap_HUT Vendor"
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!e.target.value) {
                                setMakeSwapInput(0);
                                return;
                            } else setMakeSwapInput(parseInt(e.target.value));
                        }}
                    />
                    <Button
                        sx={{ height: '50px' }}
                        variant="contained"
                        onClick={() => {
                            makeSwapHUT();
                        }}
                    >
                        Mint
                    </Button>
                </Paper>
            </Tooltip>
            <Tooltip title={'투자 목표 금액'} arrow placement={'top'}>
                <Paper
                    elevation={3}
                    sx={{
                        justifyContent: 'space-between',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        pl: '15px',
                        padding: '48px 20px',
                    }}
                >
                    <TextField
                        id="outlined-basic"
                        label="Stake Vendor"
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!e.target.value) {
                                setMakeStakeInput(0);
                                return;
                            } else setMakeStakeInput(parseInt(e.target.value));
                        }}
                    />
                    <Button
                        sx={{ height: '50px' }}
                        variant="contained"
                        onClick={() => {
                            makeStakeHUT();
                        }}
                    >
                        Mint
                    </Button>
                </Paper>
            </Tooltip>

            <Tooltip title={'ICO Vendor의 HUT잔고량'} arrow placement={'top'}>
                <Paper
                    elevation={3}
                    sx={{
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        pl: '15px',
                        padding: '40px 20px',
                        justifyContent: 'space-between',
                    }}
                >
                    <TextField
                        id="outlined-basic"
                        label="ICO Vendor"
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            console.log(e.target.value);
                            if (!e.target.value) {
                                setMakeICOInput(0);
                                return;
                            } else setMakeICOInput(parseInt(e.target.value));
                        }}
                    />
                    <Button
                        sx={{ height: '50px' }}
                        variant="contained"
                        onClick={() => {
                            makeICOHUT();
                        }}
                    >
                        Mint
                    </Button>
                </Paper>
            </Tooltip>
        </Box>
    );
};

export default CurrencyMintCard;
