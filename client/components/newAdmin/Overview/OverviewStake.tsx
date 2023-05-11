import axios from 'axios';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import CustomPieChart from './PieChart';

const OverviewStake = () => {
    const [totalStake, setTotalStake] = useState<number>(0);
    const [totalRewards, setTotalRewards] = useState<number>(0);
    const [stakeVendorHut, setStakeVendorHut] = useState<number>(0);
    const [kindList, setKindList] = useState<Array<any>>([]);

    const getStakeData = async () => {
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/adminSteakDisplay');
            setTotalStake(data.totalSteak);
            setTotalRewards(data.totalRewards);
            setStakeVendorHut(data.VendorHut);
            return data;
        } catch (error) {
            return error;
        }
    };

    const getStakingList = async () => {
        try {
            const { data } = await axios.get('http://13.125.251.97:8080/api/admin/stakingList');
            const kinds = Array.from(new Set(data.map((item: any) => item.nftId?.kind)));
            const kindCount = kinds.reduce((acc: Object, kind: any) => {
                const count = data.filter((item: any) => {
                    return item.nftId?.kind === kind;
                }).length;
                return { ...acc, [kind]: count };
            }, {});
            const kindArray = Object.entries(kindCount).reduce((acc: any, [kind, count]) => {
                if (kind && kind !== 'undefined') {
                    return [...acc, { kind, count }];
                }
                return acc;
            }, []);
            setKindList(kindArray);

            return data;
        } catch (error) {
            return error;
        }
    };

    useEffect(() => {
        getStakeData();
        getStakingList();
    }, []);
    const colors = ['#FF6633', 'var(--dark)', 'var(--lightgrey)', 'var(--blue)', '#00B3E6'];

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
            <Paper elevation={0} sx={{ display: 'flex', columnGap: '10%' }}>
                <Tooltip
                    title={'현재 진행되고 있는 총 스테이크'}
                    placement="top"
                    arrow
                    enterDelay={200}
                    leaveDelay={300}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            '&>span': { color: 'var(--blue)', fontWeight: '600' },
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            pl: '15px',
                            width: '45%',
                        }}
                    >
                        <span>totalStake</span> : {totalStake}
                    </Paper>
                </Tooltip>
                <Tooltip
                    title={'현재 진행되는 스테이크에 예상되는 총 보상액'}
                    placement="top"
                    arrow
                    enterDelay={200}
                    leaveDelay={300}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            '&>span': { color: 'var(--blue)', fontWeight: '600' },
                            height: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            pl: '15px',
                            width: '45%',
                        }}
                    >
                        <span>totalRewards</span> : {totalRewards}
                    </Paper>
                </Tooltip>
            </Paper>
            <Tooltip title={'Stake Vendor에 남아있는 잔고량'} placement="top" arrow enterDelay={200} leaveDelay={300}>
                <Paper
                    elevation={3}
                    sx={{
                        '&>span': { color: 'var(--blue)', fontWeight: '600' },
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        pl: '15px',
                        width: '45%',
                    }}
                >
                    <span>vendorHut</span> : {stakeVendorHut}
                </Paper>
            </Tooltip>
            <CustomPieChart
                dataKey={'chartKey'}
                data={kindList}
                colors={colors}
                label={(entry) => `${entry.kind} (${entry.count})`}
                onClick={(data, index) => {
                    console.log(`clicked data: ${JSON.stringify(data)}, index: ${index}`);
                }}
            />
        </Box>
    );
};

export default OverviewStake;

const OverviewBox = styled(Box)`
    position: relative;
    .topCardsContainer {
        position: relative;
        display: grid;
        transition: all 0.2s ease-in-out;
        grid-template-columns: 1fr 1fr;
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
