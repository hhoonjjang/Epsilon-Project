import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { makeReducedString } from '@/module/tools';
import Link from 'next/link';
import HoverFunction from '@/module/HoverFunction';
import { useWeb3 } from '@/hooks/useWeb3';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { getBalanceThunk } from '@/module/features/balanceSlice';

const Header = ({ account }: { account: string | undefined }) => {
    const [selected, setSelected] = useState<string>('');
    const router = useRouter();
    const dispatch = useAppDispatch();
    const getBalance = (_account: string) => dispatch(getBalanceThunk(_account));
    const accountBalance = useAppSelector((state) => state.balance);

    useEffect(() => {
        const curRoute = router.route.replaceAll('/', '');
        if (curRoute === 'nfts') setSelected('nfts');
        else if (curRoute === 'swap') setSelected('swap');
        else {
            setSelected('');
        }
    }, [router]);

    useEffect(() => {
        if (!account) return;
        getBalance(account);
    }, [account]);

    return (
        <HeaderBox>
            <LogoBox>
                <Link href={'/'}>
                    <div className="winStyle-fontGradient fg-gold ac-orange">WIN</div>
                    <div>DEX</div>
                </Link>
            </LogoBox>
            <MainPageSelectButton>
                <Link
                    href={'/nfts'}
                    className={` ${selected === 'nfts' ? 'winStyle-fontGradient fg-gold ac-orange' : ''}`}
                    onClick={() => {
                        setSelected('nfts');
                    }}
                >
                    NFTs
                </Link>
                <Link
                    href={'/swap'}
                    className={` ${selected === 'swap' ? 'winStyle-fontGradient fg-gold ac-orange' : ''}`}
                    onClick={() => {
                        setSelected('swap');
                    }}
                >
                    Swap
                </Link>
            </MainPageSelectButton>
            <UserInfoBox>
                <div>
                    <img src="/img/HUTIcon.png" alt="icon" />
                    <div>{accountBalance.HUT}</div>
                </div>

                <div>
                    <HoverFunction
                        className={'winStyle-fontGradient fg-gold ac-orange'}
                        text={account || 'defaultHashHashHashHashHash'}
                        innerText={makeReducedString(account || 'defaultHashHashHashHashHash')}
                        down={true}
                    />{' '}
                </div>
                <div>{''}</div>
            </UserInfoBox>
        </HeaderBox>
    );
};

export default Header;

const HeaderBox = styled.div`
    width: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0px;
    margin: 0 10%;
    & > div {
        width: 30%;
    }
`;

const LogoBox = styled.div`
    cursor: pointer;
    a {
        text-decoration: none;
        display: flex;
        & > div {
            font-family: 'Noto Sans KR';
            font-style: normal;
            font-weight: 900;
            font-size: 26px;
            line-height: 38px;
            /* identical to box height */
        }
        & > div:first-child {
        }
        & > div:last-child {
            color: var(--middlegrey);
        }
    }
`;

const MainPageSelectButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 30px;
    font-weight: 600;
    & > a {
        color: var(--middlegrey);
        text-decoration: none;
        outline: none;
    }
`;

const UserInfoBox = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
    column-gap: 14px;
    & > div:not(:last-child) {
        height: calc(1.2rem + 20px);
        padding: 10px 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 10px;
        img {
            width: 1rem;
        }
        & > div {
            color: var(--lightgrey);
            font-weight: 600;
        }
        font-size: 0.9rem;
        border: 1px solid var(--grey);
        border-radius: 10px;
    }
    & > div:last-child {
        position: relative;
        width: calc(1.5rem + 20px);
        height: calc(1.5rem + 20px);
        &::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            background-color: var(--grey);
            background-image: url('/img/face.png');
            background-repeat: no-repeat;
            background-size: 1.6rem 1.6rem;
            background-position: center;
            width: calc(1.5rem + 20px);
            height: 100%;
        }
    }
`;
