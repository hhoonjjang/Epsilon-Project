import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { roundNumber } from '@/module/tools';

const SideBar = () => {
    const [amount, setAmount] = useState<number>(0);
    const [difference, setDifference] = useState<number>(0);
    const [totalSteak, setTotalSteak] = useState<number>(0);
    const [totalRewards, setTotalRewards] = useState<number>(0);
    const [usd, setUSD] = useState<number>(0);

    const getAmountEarned = async () => {
        try {
            const { data } = await axios.get('http://13.125.251.97:8080/api/swap/amountEarned');
            console.log(data);
            if (data.amount) {
                setAmount(data.amount);
            }
            if (data.difference) {
                setDifference(data.difference);
            }
            if (data.usd) {
                setUSD(data.usd);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getTotalStakedData = async () => {
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/adminSteakDisplay');
            setTotalSteak(data.totalSteak);
            setTotalRewards(data.totalRewards);
            return data;
        } catch (error) {
            return error;
        }
    };

    useEffect(() => {
        getAmountEarned();
        getTotalStakedData();
    }, []);

    return (
        <SideBox>
            <SideScrollBox>
                <AmountEarnedBox>
                    <div>Amount Earned</div>
                    <div>
                        <div className="winStyle-fontGradient fg-gold ac-orange">{`${amount}`} HUT</div>
                        <div className={difference >= 0 ? 'fg-hotpink' : 'fg-blue'}>
                            {difference >= 0 ? '+' : ''}
                            {`${difference}%`}
                        </div>
                    </div>
                    <div>${roundNumber(usd, 2)} USD</div>
                </AmountEarnedBox>
                <TotalStakedBox>
                    <div>Total staked NFTs</div>
                    <div>
                        <div className="winStyle-fontGradient fg-gold ac-orange">{totalSteak}</div>
                    </div>
                    <div>{totalRewards} HUT</div>
                </TotalStakedBox>
                <InvestBox className={'winStyle-LR fg-darkgrey bg-light ac-dark'}>
                    <div className="investText">
                        <span className="fg-orange">WIN</span>DEX
                    </div>
                    <div className="investBtn">
                        <Link href={'/ico'}>투자하기</Link>
                    </div>
                </InvestBox>
                <AdBox className="winStyle-LR bg-orange ac-gold">
                    <div>
                        <img src="/img/polygonIcon.png" alt="" />
                    </div>
                    <div>새로운 세상 윈덱스</div>
                    <div>윈덱스에서 NFT를 스테이킹 해보세요</div>
                    <div>
                        <Link href={'/ico'}>시작하기</Link>
                    </div>
                </AdBox>
            </SideScrollBox>
        </SideBox>
    );
};

export default SideBar;

const SideBox = styled.div`
    position: relative;
    width: 23%;
    margin-right: 2%;
`;

const SideScrollBox = styled.div`
    width: 100%;
    position: sticky;
    top: 20px;
    & > div {
        margin-bottom: 20px;
    }
    padding-bottom: 2px;
`;

const AmountEarnedBox = styled.div`
    padding: 30px 18px;
    border-radius: 15px;
    border: 1px solid var(--grey);
    display: flex;
    flex-direction: column;
    row-gap: 15px;
    & > div:first-child {
        color: var(--lightgrey);
        font-size: 0.9rem;
    }
    & > div:nth-child(2) {
        display: flex;
        column-gap: 10px;
        font-weight: 600;

        & > div:last-child {
            color: var(--blue);
            display: flex;
            align-items: center;
            font-size: 0.7rem;
        }
    }
    & > div:last-child {
        font-size: 0.9rem;
        color: var(--middlegrey);
    }
`;

const TotalStakedBox = styled.div`
    padding: 30px 18px;
    border-radius: 15px;
    border: 1px solid var(--grey);
    display: flex;
    flex-direction: column;
    row-gap: 15px;
    & > div:first-child {
        color: var(--lightgrey);
        font-size: 0.9rem;
    }
    & > div:nth-child(2) {
        display: flex;
        column-gap: 10px;
        font-weight: 600;
    }
    & > div:last-child {
        font-size: 0.9rem;
        color: var(--middlegrey);
    }
`;

const AdBox = styled.div`
    box-shadow: 0px 0px 20px 0px #ff6f0059;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 20px;
    border-radius: 15px;
    padding: 50px 15px;
    & a {
        text-decoration: none;
        outline: none;
        color: black;
    }
    & > div:first-child {
        img {
            width: 79px;
            height: 79px;
            background-color: transparent;
        }
    }
    & > div:nth-child(2) {
        font-size: 1rem;
        font-weight: 600;
    }
    & > div:nth-child(3) {
        font-size: 0.7rem;
        letter-spacing: -1px;
    }
    & > div:last-child {
        font-size: 0.7rem;
        font-weight: 600;
        border-radius: 10px;
        background-color: var(--light);
        padding: 15px 20px;
        color: var(--black);
        cursor: pointer;
        &:hover {
            & a {
                color: var(--light);
            }

            background-color: var(--grey);
        }
    }
`;

const InvestBox = styled.div`
    width: 100%;
    padding: 25px 20px 35px 20px;
    box-shadow: 0 0 5px var(--white);
    display: flex;
    flex-direction: column;
    border-radius: 15px;
    row-gap: 20px;
    & a {
        width: 100%;
        text-decoration: none;
        color: var(--black);
        font-size: 0.7rem;
        font-weight: 600;
        border-radius: 10px;
        background-color: var(--light);
        padding: 15px 20px;
        &:hover {
            color: var(--light);
            background-color: var(--grey);
        }
    }
    & .investBtn {
        text-align: right;
    }

    background-color: var(--grey);
`;
