import styledComp from 'styled-components';
import { Box, Grid, Paper } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import axios from 'axios';
import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { makeReducedString } from '../../module/tools';
import SideMenu from '@/components/newAdmin/SideMenu/SideMenu';
import ICO from '@/components/newAdmin/CRUD/ICO/ICO';
import Stake from '@/components/newAdmin/CRUD/Stake/Stake';
import TxAdmin from '@/components/newAdmin/CRUD/Transactions/Admin';
import User from '@/components/newAdmin/CRUD/Transactions/User';
import Overview from '@/components/newAdmin/Overview/Overview';
import Currency from '@/components/newAdmin/Currency/Currency';

interface IStakingItem {
    name: string;
    tokenId: number;
    average: number;
    price: number;
    amount: Array<number>;
    id: number;
    createdAt: Date;
    kind: string;
    nftId: any;
}

interface IStakeDuration {
    duration: number;
    charge: number;
}

const Admin = ({ web3, account }: { web3: any; account: string }) => {
    const [adminPassWord, setAdminPassword] = useState<string>('');
    const [access, setAccess] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [page, setPage] = useState<string>('Overview');

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isTablet, setIsTablet] = useState<boolean>(false);

    const handleResize = () => {
        if (window.innerWidth >= 768) {
            setIsTablet(true);
            setIsMobile(false);
        } else {
            setIsTablet(false);
            setIsMobile(true);
        }
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const drawerWidth = 240;

    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
        open?: boolean;
    }>(({ theme, open }) => ({
        flexGrow: 0,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `${drawerWidth}px`,
        ...(!open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 64,
        }),
    }));

    if (!access) {
        return (
            <AdminLoginBox className={'fg-black'}>
                <div>관리자 {makeReducedString(account)} 계정 접근 확인</div>
                <h1 className="adminLoginTitle fg-orange">관리자 페이지 로그인</h1>
                <input
                    type="password"
                    onInput={(e) => setAdminPassword(e.currentTarget.value)}
                    placeholder="비밀번호 입력"
                />
                <button
                    className="bg-blue"
                    onClick={(e) => {
                        if (adminPassWord === 'test') setAccess(true);
                    }}
                >
                    확인
                </button>
            </AdminLoginBox>
        );
    } else {
        return (
            <AdminBox>
                <SideMenu open={open} setOpen={setOpen} setPage={setPage} page={page} />
                <Main open={open}>
                    {page == 'Overview' && <Overview />}
                    {page == 'Currency' && <Currency web3={web3} account={account} />}
                    {page == 'Stake' && <Stake web3={web3} account={account} />}
                    {page == 'ICO' && <ICO account={account} web3={web3} />}
                    {page == 'Admin' && <TxAdmin />}
                    {page == 'User' && <User />}
                </Main>
            </AdminBox>
        );
    }
};

export default Admin;

const AdminLoginBox = styledComp(Box)`
    width: 100%;
    height: 100vh;
    display: flex;
    row-gap: 30px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & .adminLoginTitle {
        font-size: 2rem;
    }
    input {
        padding: 3px 10px;
    }
    button {
        padding: 10px 20px;
    }
`;

const AdminBox = styledComp.div`
    width: 100%;
    color: var(--darkgrey);
`;
