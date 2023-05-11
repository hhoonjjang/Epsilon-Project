import OverviewCard from '../Overview/OverviewCard';
import { Box, Grid, Paper } from '@mui/material';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useState, useEffect } from 'react';
import CurrencyVendorCard from './CurrencyVendorCard';
import CurrencyMintCard from './CurrencyMintCard';
import CurrencyFeeRate from './CurrencyFeeRate';
import CurrencyWithdrawCard from './CurrencyWithdrawCard';

const Currency = ({ web3, account }: { web3: any; account: string }) => {
    const [stakeVendorHut, setStakeVendorHut] = useState<number>(0);
    const [swapVendorHut, setSwapVendorHut] = useState<Array<number>>([0, 0]);
    const [totalSwapSupplyHut, setTotalSwapSupplyHut] = useState<number>(0);
    const [totalStake, setTotalStake] = useState<number>(0);
    const [totalRewards, setTotalRewards] = useState<number>(0);
    const [icoVendorHut, setICOVendorHut] = useState<number>(0);
    const [icoTarget, setICOTarget] = useState<number>(0);
    const [icoAmount, setICOAmount] = useState<number>(0);
    const [icoInvestor, setICOInvestor] = useState<number>(0);
    const [withdrawHUTInput, setWithdrawHUTInput] = useState<number>();
    const [withdrawMATICInput, setWithdrawMATICInput] = useState<number>();

    const getTotalStakedData = async () => {
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/adminSteakDisplay');
            setTotalStake(data.totalSteak);
            setTotalRewards(data.totalRewards);
            setStakeVendorHut(data.VendorHut);
        } catch (error) {}
    };
    const getSwapHutAmount = async () => {
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/adminSwapDisplay');
            setSwapVendorHut([data.vendorHutAmount, data.vendorMaticAmount]);
            setTotalSwapSupplyHut(data.totalSupplyHut);
        } catch (error) {}
    };

    const getICOHutAmount = async () => {
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/IcoAdminDisplay');
            setICOTarget(data.targetAmount);
            setICOAmount(data.nowAmount);
            setICOVendorHut(data.hutAmount);
            setICOInvestor(data.investors);
            console.log(data);
        } catch (error) {}
    };

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

    useEffect(() => {
        getTotalStakedData();
        getSwapHutAmount();
        getICOHutAmount();
    }, []);

    return (
        <CurrencyBox>
            <Paper sx={{ padding: '20px 0px 20px 20px', fontSize: '2rem', fontWeight: '600', color: 'var(--blue)' }}>
                Currency
            </Paper>
            <Divider />
            <Grid container gap={2} className={'topCardsContainer'}>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <CurrencyVendorCard
                            stakeVendorHut={stakeVendorHut}
                            swapVendorHut={swapVendorHut}
                            totalSwapSupplyHut={totalSwapSupplyHut}
                            icoVendorHut={icoVendorHut}
                        />
                    </Paper>
                </Grid>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <CurrencyMintCard web3={web3} account={account} />
                    </Paper>
                </Grid>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <OverviewCard title={'Swap'} />
                    </Paper>
                </Grid>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <CurrencyFeeRate web3={web3} account={account} />
                    </Paper>
                </Grid>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <CurrencyWithdrawCard web3={web3} account={account}></CurrencyWithdrawCard>
                    </Paper>
                </Grid>
            </Grid>
        </CurrencyBox>
    );
};

export default Currency;

const CurrencyBox = styled(Box)`
    .topCardsContainer {
        display: grid;
        grid-template-columns: 1fr;

        @media screen and (min-width: 768px) {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    .dataCard {
        padding: 20px;
    }
`;
