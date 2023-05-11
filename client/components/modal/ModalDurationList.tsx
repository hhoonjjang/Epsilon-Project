import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHook';
import { setAmount, setDuration, setCharge } from '@/module/features/stakeSlice';
import { reset } from '@/module/features/stakeSlice';
import axios from 'axios';

const ModalDurationList = () => {
    const [selectedDuration, setSelectedDuration] = useState<number>(0);
    const inputRef = useRef(null);
    const modal = useAppSelector((state) => state.modal);
    const stake = useAppSelector((state) => state.stake);
    const durationAndCharge = useAppSelector((state) => state.durationAndCharge);
    const dispatch = useAppDispatch();

    useEffect(() => {
        switch (selectedDuration) {
            case 1: {
                dispatch(setDuration(durationAndCharge[0].duration));
                dispatch(setCharge(durationAndCharge[0].charge));
                break;
            }
            case 2:
                dispatch(setDuration(durationAndCharge[1].duration));
                dispatch(setCharge(durationAndCharge[1].charge));
                break;
            case 3:
                dispatch(setDuration(durationAndCharge[2].duration));
                dispatch(setCharge(durationAndCharge[2].charge));
                break;
            default:
                dispatch(setDuration(0));
                dispatch(setCharge(0));
                break;
        }
    }, [selectedDuration]);

    useEffect(() => {
        if (!modal.isOpen) {
            dispatch(reset({}));
        }
    }, [modal.isOpen]);

    return (
        <>
            <ModalDurationListBox>
                <li
                    onClick={() => {
                        if (selectedDuration == 1) setSelectedDuration(0);
                        else setSelectedDuration(1);
                    }}
                    className={selectedDuration == 1 ? 'selectedDuration' : ''}
                >
                    <div>The Starter</div>
                    <div>{durationAndCharge[0].duration} Months</div>
                    <div>{durationAndCharge[0].charge}%</div>
                </li>
                <li
                    onClick={() => {
                        if (selectedDuration == 2) setSelectedDuration(0);
                        else setSelectedDuration(2);
                    }}
                    className={selectedDuration == 2 ? 'selectedDuration' : ''}
                >
                    <div>The Regular</div>
                    <div>{durationAndCharge[1].duration} Months</div>
                    <div>{durationAndCharge[1].charge}%</div>
                </li>
                <li
                    onClick={() => {
                        if (selectedDuration == 3) setSelectedDuration(0);
                        else setSelectedDuration(3);
                    }}
                    className={selectedDuration == 3 ? 'selectedDuration' : ''}
                >
                    <div>The Popular</div>
                    <div>{durationAndCharge[2].duration} Months</div>
                    <div>{durationAndCharge[2].charge}%</div>
                </li>
            </ModalDurationListBox>
            <WarningText className="fg-hotpink">스테이킹 시 수수료 1%가 발생합니다.</WarningText>
            <InputBox className="amountInputBox">
                <div>Stake Amount : </div>
                <input
                    ref={inputRef}
                    className="amountInput"
                    type="number"
                    placeholder="amount"
                    onInput={(e) => {
                        dispatch(setAmount(+e.currentTarget.valueAsNumber));
                    }}
                />
            </InputBox>
        </>
    );
};

export default ModalDurationList;

const ModalDurationListBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > li {
        border-radius: 5px;
        padding: 19px;
        padding-top: 120px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        row-gap: 9px;
        width: 30%;
        border: 1px solid var(--grey);
        cursor: pointer;
        &.selectedDuration {
            border: 1px solid var(--gold);
        }
        &:nth-child(1) {
            background: url('/img/Coin1.png');
        }
        &:nth-child(2) {
            background: url('/img/Coin2.png');
        }
        &:nth-child(3) {
            background: url('/img/Coin3.png');
        }
        &:nth-child(n) {
            background-repeat: no-repeat;
            background-size: contain;
            background-position: 0 -20px;
        }

        &:hover {
            border: 1px solid var(--gold);
        }
        &:active {
            border: 1px solid var(--grey);
        }
        & > div:nth-child(1) {
            font-size: 12px;
            color: var(--middlegrey);
        }
        & > div:nth-child(2) {
            font-size: 14px;
        }
        & > div:nth-child(3) {
            font-size: 36px;
            font-weight: 1000;
        }
    }
`;

const WarningText = styled.div`
    width: 100%;
    text-align: end;
    background-color: transparent;
    font-size: 12px;
`;

const InputBox = styled.div`
    width: 100%;
    &.amountInputBox {
        display: flex;
        justify-content: right;
        column-gap: 10px;
        align-items: center;
        & .amountInput {
            text-align: right;
            position: relative;
            outline: none;
            border: none;
            border-radius: 10px;
            padding: 5px;
            padding-right: 20px;
            width: 50%;
            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            &:focus {
                outline: none;
                box-shadow: none;
            }
        }
    }
`;
