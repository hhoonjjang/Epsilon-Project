import axios from 'axios';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const CurrencyWithdrawCard = ({ web3, account }: { web3: any; account: string }) => {
    const [withdrawHUTInput, setWithdrawHUTInput] = useState<number>();
    const [withdrawMATICInput, setWithdrawMATICInput] = useState<number>();

    const withdrawHUT = async () => {
        console.log(withdrawHUTInput);
        const { data } = await axios.post('http://13.125.251.97:8080/api/contract/withdrawHutToken', {
            amount: withdrawHUTInput,
            account,
        });
        if (web3.web3) {
            try {
                const withdrawHUT = await web3?.web3.eth.sendTransaction(data);
                console.log(withdrawHUT);
                const txData = {
                    amount: Number(withdrawHUTInput),
                    type: 'Token',
                    status: 'Success',
                    from: withdrawHUT.from,
                    to: withdrawHUT.to,
                    hash: withdrawHUT.transactionHash,
                    saveType: 'withdraw',
                };
                const { data: saveData } = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', {
                    ...txData,
                });
                return saveData;
            } catch (error) {
                console.error(error);
                return error;
            }
        }
    };

    useEffect(() => {
        console.log(withdrawHUTInput, withdrawMATICInput);
    }, [withdrawHUTInput, withdrawMATICInput]);

    const withdrawMatic = async () => {
        console.log(withdrawMATICInput);
        const { data } = await axios.post('http://13.125.251.97:8080/api/contract/withdrawMatic', {
            amount: withdrawMATICInput,
            account,
        });
        if (web3.web3) {
            try {
                const withdrawMatic = await web3?.web3.eth.sendTransaction(data);
                console.log(withdrawMatic);
                const txData = {
                    amount: Number(withdrawHUTInput),
                    type: 'Token',
                    status: 'Success',
                    from: withdrawMatic.from,
                    to: withdrawMatic.to,
                    hash: withdrawMatic.transactionHash,
                    saveType: 'withdraw',
                };
                const { data: saveData } = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', {
                    ...txData,
                });
                return saveData;
            } catch (error) {
                console.error(error);
                return error;
            }
        }
    };

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
                Withdraw
            </Paper>

            <Tooltip title={'HUT 인출'} arrow placement={'top'}>
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
                        label="Withdraw HUT"
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!e.target.value) {
                                setWithdrawHUTInput(0);
                                return;
                            } else setWithdrawHUTInput(parseInt(e.target.value));
                        }}
                    />
                    <Button
                        sx={{ height: '50px' }}
                        variant="contained"
                        onClick={async () => {
                            await withdrawHUT();
                            console.log('asdfasdf');
                        }}
                    >
                        Withdraw
                    </Button>
                </Paper>
            </Tooltip>
            <Tooltip title={'Matic 인출'} arrow placement={'top'}>
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
                        label="Withdraw Matic"
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!e.target.value) {
                                setWithdrawMATICInput(0);
                                return;
                            } else setWithdrawMATICInput(parseInt(e.target.value));
                        }}
                    />
                    <Button
                        sx={{ height: '50px' }}
                        variant="contained"
                        onClick={() => {
                            withdrawMatic();
                        }}
                    >
                        withdraw
                    </Button>
                </Paper>
            </Tooltip>
        </Box>
    );
};

export default CurrencyWithdrawCard;
