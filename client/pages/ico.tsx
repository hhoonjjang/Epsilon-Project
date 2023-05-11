import styled from 'styled-components';
import axios from 'axios';
import { useEffect, useState } from 'react';
import CountdownClock from '@/components/CountdownClock';
import { modalAsync } from '@/module/features/modalSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';

const ICO = ({ web3, account }: { web3: any; account: string }) => {
    const [investAmount, setInvestAmount] = useState<number>(0);
    const [deadLine, setDeadLine] = useState<number>(new Date('2023-04-29 17:40:00').getTime());
    const [nowAmount, setNowAmount] = useState<number>(0);
    const dispatch = useAppDispatch();
    const modal = useAppSelector((state) => state.modal);

    const getICOUserDisplay = async () => {
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/IcoUserDisplay');
            console.log(data);
            setDeadLine(Number(data.deadLine) * 1000);
            setNowAmount(data.nowAmount);
            return data;
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    const investFunc = async () => {
        let status = '';
        if (!investAmount) return;
        if (deadLine < Date.now()) return alert('투자 기한이 지났습니다.');
        try {
            console.log('click');
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/invest', {
                account,
                amount: investAmount,
            });
            console.log(data);
            const { data: saveData } = await web3.web3.eth.sendTransaction(data.sendMaticObj);
            status = 'success';
        } catch (error) {
            console.error(error);
            status = 'fail';
        }
        return status;
    };

    useEffect(() => {
        getICOUserDisplay();
    }, []);

    return (
        <ICOBox>
            <ICOTitle className="fg-gold">Expiration</ICOTitle>
            <ClockBox>
                <CountdownClock unit={'day'} deadLine={deadLine} />
                <CountdownClock unit={'hour'} deadLine={deadLine} />
                <CountdownClock unit={'minute'} deadLine={deadLine} />
                <CountdownClock unit={'second'} deadLine={deadLine} />
            </ClockBox>
            <ICOGaugeBox percent={nowAmount}>
                <div className="bar"></div>
                <img src="/img/gauge.svg" alt="" />
            </ICOGaugeBox>
            <AmountInputBox>
                <input
                    type="number"
                    onInput={(e) => {
                        setInvestAmount(e.currentTarget.valueAsNumber);
                    }}
                />
            </AmountInputBox>

            <ICOButtonBox
                className="winStyle-button"
                data-title="투자하기"
                onClick={() => {
                    dispatch(modalAsync({ ...modal, promiseFunc: investFunc() }));
                }}
            >
                <div>투자하기</div>
            </ICOButtonBox>
        </ICOBox>
    );
};

export default ICO;

const ICOBox = styled.div`
    position: relative;
    width: 80%;
    margin: 50px 10%;
    padding: 50px 0;
    border-radius: 15px;
    border: 1px solid var(--grey);
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    /* &::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        background: url('/img/warning.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        z-index: 50;
        opacity: 0.5;
    } */
`;

const ClockBox = styled.div`
    width: 50%;
    display: flex;
    & > div {
        border: 1px solid var(--grey);
    }
    margin: 20px 0;
`;

const ICOGaugeBox = styled.div<{ percent: number }>`
    position: relative;
    --height: 85%;
    --width: 50%;
    width: var(--width);
    height: var(--height);
    display: flex;
    justify-content: left;
    margin: 40px 0;
    & .bar {
        /* -webkit-mask-image: url('/img/gaugeMask.svg');
        mask-image: url('/img/gaugeMask.svg');
        mask-repeat: no-repeat;
        mask-size: auto, auto;
        mask-position: 0 0; */
        position: absolute;
        border-radius: 15px;
        top: 8%;
        left: 7px;
        width: ${({ percent }) => percent - 3}%;
        height: 80%;
        transition: all 1s ease-in-out;
        background-color: green;
        transform: translateX(0%);
    }
    img {
        filter: invert(58%) sepia(61%) saturate(3236%) hue-rotate(3deg) brightness(108%) contrast(101%);
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const ICOButtonBox = styled.div`
    border: 1px solid red;
    color: red;
    padding: 20px 30px;
    width: fit-content;
`;

const AmountInputBox = styled.div`
    width: 100%;
    display: flex;
    margin-bottom: 30px;

    input {
        margin: auto;
        padding: 3px 5px;
    }
`;

const ICOTitle = styled.div`
    width: 100%;
    text-align: center;
    height: 50px;
    font-size: 2rem;
    margin: 20px 0;
`;
