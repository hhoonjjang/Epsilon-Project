import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { useEffect } from 'react';

import SwapBox from '@/components/SwapComponent/SwapBox';
import FeeExpected from '@/components/SwapComponent/FeeExpected';
import TransactionFee from '@/components/SwapComponent/TransactionFee';
import { useState } from 'react';
import ITokenExchange from '@/interface/ITokenExchange.interface';
import { getBalanceThunk } from '@/module/features/balanceSlice';

const Swap = ({ web3, account }: { web3: any; account: string }) => {
    const [exchangePercent, setExchangePercent] = useState<Number>(0);
    const [tokenExchange, setTokenExchange] = useState<ITokenExchange>({
        from: '',
        to: '',
        amount: 0,
        conversion: 0,
        toUSD: 0,
    });

    const dispatch = useAppDispatch();
    const getBalance = (_account: string) => dispatch(getBalanceThunk(_account));
    useEffect(() => {
        if (account) {
            getBalance(account);
        }
    }, [account]);
    return (
        <SwapOutter>
            <SwapBox
                setExchangePercent={setExchangePercent}
                setTokenExchange={setTokenExchange}
                web3={web3}
                account={account}
            />
            <FeeExpected exchangePercent={exchangePercent} tokenExchange={tokenExchange} />
            <TransactionFee />
        </SwapOutter>
    );
};

export default Swap;

const SwapOutter = styled.div`
    & > div {
        margin-top: 8rem;
    }
`;
