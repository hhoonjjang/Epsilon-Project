import axios from 'axios';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const OverviewICO = () => {
    const [icoTarget, setICOTarget] = useState<number>(0);
    const [icoAmount, setICOAmount] = useState<number>(0);
    const [icoInvestor, setICOInvestor] = useState<number>(0);
    const [icoVendorHut, setICOVendorHut] = useState<number>(0);

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
    console.log(icoTarget);

    useEffect(() => {
        getICOData();
    }, []);
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
            <OverviewBox ratio={!Number.isNaN(icoAmount / icoTarget) ? icoAmount / icoTarget : 0}>
                <Tooltip
                    title={`( ${icoAmount} / ${icoTarget} )`}
                    placement={'top'}
                    arrow
                    enterDelay={200}
                    leaveDelay={300}
                >
                    <Grid container gap={0} className={'topCardsContainer'}>
                        <Grid marginY={2}>
                            <Paper className={'base'}></Paper>
                        </Grid>
                        <Grid marginY={2}>
                            <Paper className={'hp'}></Paper>
                        </Grid>
                    </Grid>
                </Tooltip>
            </OverviewBox>
            <Tooltip title={'투자 목표 금액'} arrow placement={'top'}>
                <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                    target : {icoTarget}
                </Paper>
            </Tooltip>
            <Tooltip title={'현재 모인 금액'} arrow placement={'top'}>
                <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                    amount : {icoAmount}
                </Paper>
            </Tooltip>
            <Tooltip title={'투자자수'} arrow placement={'top'}>
                <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                    investor : {icoInvestor}
                </Paper>
            </Tooltip>
            <Tooltip title={'ICO Vendor의 HUT잔고량'} arrow placement={'top'}>
                <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                    vendorHut : {icoVendorHut}
                </Paper>
            </Tooltip>
        </Box>
    );
};

export default OverviewICO;

const OverviewBox = styled(Box)<{ ratio: number }>`
    position: relative;
    .topCardsContainer {
        position: relative;
        display: grid;
        transition: all 0.2s ease-in-out;
        grid-template-columns: ${({ ratio }) => ratio}fr ${({ ratio }) => 1 - ratio}fr;
    }
    .base {
        position: relative;
        padding: 20px 0;
        transition: all 0.2s ease-in-out;
        background-color: var(--blue);
        border-radius: 0;
        border: none;
        z-index: 1;
    }
    .hp {
        padding: 20px 0;
        transition: all 0.2s ease-in-out;
        background-color: var(--lightgrey);
        border-radius: 0;
        border: none;
        z-index: 2;
    }
    & > div {
    }
`;
