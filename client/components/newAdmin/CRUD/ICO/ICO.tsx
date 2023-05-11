import { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import { Box, Grid, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import CustomProgressBar from '../../Overview/ProgressBar';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ICO = ({ account, web3 }: { account: string; web3: any }) => {
    const [icoTarget, setICOTarget] = useState<number>(0);
    const [icoAmount, setICOAmount] = useState<number>(0);
    const [icoInvestor, setICOInvestor] = useState<number>(0);
    const [icoVendorHut, setICOVendorHut] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const getICOData = async () => {
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/IcoAdminDisplay');
            setICOTarget(data.targetAmount);
            setICOAmount(data.nowAmount);
            setICOVendorHut(data.hutAmount);
            setICOInvestor(data.investors);
            return data;
        } catch (error) {
            return error;
        }
    };

    const goalClick = async () => {
        console.log('asdf');
        try {
            console.log(account);
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/reachedGoal', { account });
            console.log(data);
            if (web3.web3) {
                try {
                    const txData = await web3.web3.eth.sendTransaction(data);
                    console.log(txData);
                    handleClick('success');
                } catch (error) {
                    console.log(error);
                    handleClick('error');
                }
            }
        } catch (error) {
            console.error(error);
            handleClick('error');
            return error;
        }
    };

    const handleClick = (type: string, message?: string) => {
        if (type == 'success') {
            setOpen(true);
        } else if (type == 'error') {
            if (message) {
                setErrorMessage(message);
            }
            setErrorOpen(true);
        }
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
        setOpen(false);
        setTimeout(() => {
            setErrorMessage('This is Error Message');
        }, 200);
    };

    useEffect(() => {
        getICOData();
    }, []);
    return (
        <>
            <Paper
                elevation={3}
                sx={{ padding: '20px 0px 20px 20px', fontSize: '2rem', fontWeight: '600', color: 'var(--blue)' }}
            >
                ICO
            </Paper>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    This is a success message!
                </Alert>
            </Snackbar>
            <Snackbar open={errorOpen} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Box sx={{ display: 'flex', columnGap: '10%' }}>
                <Paper
                    elevation={3}
                    sx={{
                        mt: '20px',
                        padding: '20px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        rowGap: '20px',
                        flexDirection: 'column',
                        mb: '20px',
                        width: '45%',
                    }}
                >
                    <Tooltip title={'현재까지 모은 Matic 모금액'} placement={'top'} arrow>
                        <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                            {(icoAmount * 100) / icoTarget} % 의 목표액 달성
                        </Paper>
                    </Tooltip>
                    <Tooltip title={'투자자 수'} placement={'top'} arrow>
                        <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                            {icoInvestor || 0} 명의 투자
                        </Paper>
                    </Tooltip>
                    <Tooltip title={'ICO에 남아있는 HUT 잔량'} placement={'top'} arrow>
                        <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                            ICO Vender : {icoVendorHut}
                        </Paper>
                    </Tooltip>
                </Paper>
                <Paper
                    elevation={3}
                    sx={{
                        mt: '20px',
                        padding: '20px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        rowGap: '20px',
                        flexDirection: 'column',
                        mb: '20px',
                        width: '45%',
                    }}
                >
                    <Box>Progress Bar</Box>
                    <CustomProgressBar value={icoAmount} goal={icoTarget} />
                </Paper>
            </Box>

            <Button
                sx={{ height: '40px' }}
                variant="contained"
                onClick={() => {
                    console.log(icoAmount, icoTarget, icoAmount >= icoTarget);
                    if (icoAmount >= icoTarget) goalClick();
                    else {
                        handleClick('error', 'ICO Error');
                    }
                }}
            >
                정산하기
            </Button>
        </>
    );
};

export default ICO;
