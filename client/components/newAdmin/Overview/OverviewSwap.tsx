import axios from 'axios';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { roundNumber } from '@/module/tools';

interface ITokenExchange {
    amount: number;
    conversion: number;
    from: string;
    to: string;
    toUSD: number;
}

const OverviewSwap = () => {
    const [maticToValue, setMaticToValue] = useState<number>(0);
    const [maticExchangePercent, setMaticExchangePercent] = useState<number>(0);
    const [maticTokenExchange, setMaticTokenExchange] = useState<ITokenExchange>();
    const [hutToValue, setHutToValue] = useState<number>(0);
    const [hutExchangePercent, setHutExchangePercent] = useState<number>(0);
    const [hutTokenExchange, setHutTokenExchange] = useState<ITokenExchange>();

    const getMaticToHutData = async () => {
        try {
            const {
                data: { conversion, percent = 0, tokenExchange },
            } = await axios.get('http://13.125.251.97:8080/api/swap/exchange', {
                params: {
                    from: 'matic',
                    to: 'HUT',
                    amount: 1,
                },
            });
            setMaticToValue(() => conversion);
            setMaticExchangePercent(percent);
            setMaticTokenExchange(tokenExchange);
            return conversion;
        } catch (error) {
            return error;
        }
    };
    const getHutToMaticData = async () => {
        try {
            const {
                data: { conversion, percent = 0, tokenExchange },
            } = await axios.get('http://13.125.251.97:8080/api/swap/exchange', {
                params: {
                    from: 'HUT',
                    to: 'matic',
                    amount: 1,
                },
            });
            setHutToValue(() => conversion);
            setHutExchangePercent(percent);
            setHutTokenExchange(tokenExchange);
            console.log(tokenExchange);
            return conversion;
        } catch (error) {
            return error;
        }
    };

    useEffect(() => {
        getHutToMaticData();
        getMaticToHutData();
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
                '& .matic': {
                    padding: '0 5px',
                    color: 'var(--hotpink)',
                    fontWeight: 600,
                },
                '& .hut': {
                    padding: '0 5px',
                    color: 'var(--orange)',
                    fontWeight: 600,
                },
            }}
        >
            <Tooltip title={'1 Matic당 얻을 수 있는 HUT량'} placement={'top'} arrow>
                <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                    1 <span className="matic">Matic</span> = {maticToValue} <span className="hut"> HUT </span> (usd : $
                    {maticTokenExchange?.toUSD})
                </Paper>
            </Tooltip>
            <Tooltip title={'Matic => HUT 교환비'} placement={'top'} arrow>
                <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                    교환비 : {roundNumber(maticExchangePercent, 8)}
                </Paper>
            </Tooltip>
            <Divider />
            <Tooltip title={'1 HUT당 얻을 수 있는 Matic량'} placement={'top'} arrow>
                <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                    1 <span className={'hut'}>HUT</span> = {hutToValue} <span className="matic">Matic</span> (usd : $
                    {hutTokenExchange?.toUSD})
                </Paper>
            </Tooltip>
            <Tooltip title={'HUT => Matic 교환비'} placement={'top'} arrow>
                <Paper elevation={3} sx={{ height: '30px', display: 'flex', alignItems: 'center', pl: '15px' }}>
                    교환비 : {roundNumber(hutExchangePercent, 8)}
                </Paper>
            </Tooltip>
        </Box>
    );
};

export default OverviewSwap;
