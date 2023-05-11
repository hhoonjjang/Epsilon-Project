import axios from 'axios';
import { useState, useEffect } from 'react';
import CustomBarChart from '../Overview/BarChart';
import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import MyCustomBarChart from '../Overview/CustomBarChart';

interface IProps {
    stakeVendorHut: number;
    swapVendorHut: number[];
    totalSwapSupplyHut: number;
    icoVendorHut: number;
}

const CurrencyVendorCard = ({ stakeVendorHut, swapVendorHut, totalSwapSupplyHut, icoVendorHut }: IProps) => {
    const colors = ['#FF6633', 'var(--dark)', 'var(--lightgrey)', 'var(--blue)', '#00B3E6'];
    console.log(stakeVendorHut, swapVendorHut, totalSwapSupplyHut, icoVendorHut);
    return (
        <ChartBox>
            <Paper
                className={'header'}
                sx={{ width: '100%', marginBottom: '50px', padding: '20px 0', fontSize: '1.5rem', pl: '20px' }}
            >
                Vendor Balance
            </Paper>
            <>
                <MyCustomBarChart
                    data={[
                        { type: 'stake', count: stakeVendorHut },
                        { type: 'swap_HUT', count: swapVendorHut[0] },
                        { type: 'swap_Matic', count: swapVendorHut[1] },
                        { type: 'ico', count: icoVendorHut },
                    ]}
                />
            </>
        </ChartBox>
    );
};

export default CurrencyVendorCard;

const ChartBox = styled.div`
    width: 100%;
    height: 100%;
    padding: 50px;
    padding-top: 20px;
`;
