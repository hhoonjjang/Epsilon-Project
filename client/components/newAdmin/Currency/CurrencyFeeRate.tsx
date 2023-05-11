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

const CurrencyFeeRate = ({ web3, account }: { web3: any; account: string }) => {
    const [feeRateInput, setFeeRate] = useState<number>();

    const setFeeRateFunc = async () => {
        if (!feeRateInput || feeRateInput > 100 || feeRateInput <= 0) return;
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/setFeeRate', {
                rate: feeRateInput,
                account,
            });
            console.log(data);
            if (web3.web3) {
                try {
                    const feeRate = await web3?.web3.eth.sendTransaction(data);
                    const txData = {
                        amount: Number(feeRateInput),
                        type: 'FeeRate',
                        status: 'Success',
                        from: feeRate.from,
                        to: feeRate.to,
                        hash: feeRate.transactionHash,
                        saveType: 'feeRate',
                    };
                    // const {data : saveData} = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', {...txData});
                    setFeeRate(0);
                    return feeRate;
                } catch (error) {
                    console.error(error);
                    return error;
                }
            }
        } catch (error) {}
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
                FeeRate
            </Paper>
            <Tooltip title={'투자 목표 금액'} arrow placement={'top'}>
                <Paper
                    elevation={3}
                    sx={{
                        justifyContent: 'space-between',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        pl: '15px',
                        padding: '20px',
                    }}
                >
                    FeeRate : 0
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
                        label="Fee Amount"
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (!e.target.value) {
                                setFeeRate(0);
                                return;
                            } else setFeeRate(parseInt(e.target.value));
                        }}
                    />
                    <Button
                        sx={{ height: '50px' }}
                        variant="contained"
                        onClick={() => {
                            setFeeRateFunc();
                        }}
                    >
                        Set
                    </Button>
                </Paper>
            </Tooltip>
        </Box>
    );
};

export default CurrencyFeeRate;
