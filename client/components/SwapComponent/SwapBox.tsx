import styled from 'styled-components';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { setAmount, tokenSwapTo } from '@/module/features/swapTokenSelectedSlice';
import { modalClose, modalRequest, modalType, modalAsync } from '@/module/features/modalSlice';
import { tokenSwapFrom } from '@/module/features/swapTokenSelectedSlice';
import ITokenExchange from '@/interface/ITokenExchange.interface';
import { getBalanceThunk } from '@/module/features/balanceSlice';

interface ISwapData {
    from: string;
    to: string;
    amount: number;
}
interface SwapProps {
    setExchangePercent: Dispatch<SetStateAction<Number>>;
    setTokenExchange: Dispatch<SetStateAction<ITokenExchange>>;
    web3: any;
    account: string;
}

const SwapBox = ({ setExchangePercent, setTokenExchange, web3, account }: SwapProps) => {
    console.log('나는 계좌', account);
    const dispatch = useAppDispatch();
    const setModalTypeFunction = (_type: string) => {
        dispatch(modalType(_type));
    };
    const getBalance = (_account: string) => dispatch(getBalanceThunk(_account));
    const swapToken = useAppSelector((state) => state.swapToken);
    const modal = useAppSelector((state) => state.modal);
    const slippage = useAppSelector((state) => state.slippage);
    const accountBalance = useAppSelector((state) => state.balance);

    const [fromValue, setFromValue] = useState<number>(0);
    const [toValue, setToValue] = useState<number>(0);
    const [isInputting, setIsInputting] = useState<boolean>(false);

    const swapCheckData: ISwapData = { ...swapToken, amount: fromValue };

    const fromInput = useRef<HTMLInputElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        dispatch(tokenSwapFrom('notChoose'));
        dispatch(tokenSwapTo('HUT'));
        dispatch(setAmount(0));
    }, []);

    useEffect(() => {
        console.log(web3, account);
    }, [web3]);

    useEffect(() => {
        setFromValue(swapToken.amount);
    }, [swapToken]);

    useEffect(() => {
        // attach event listeners
        if (fromInput && fromInput.current) {
            fromInput.current.valueAsNumber = +fromInput.current?.value;
            console.log(timeoutRef.current, '나는 타임레프임');
            timeoutRef.current = setTimeout(async () => {
                // console.log('입력이 끝났습니다.');
                if (
                    fromInput.current?.value &&
                    fromValue &&
                    swapToken.from != 'notChoose' &&
                    swapToken.to != 'notChoose'
                ) {
                    await exchangeRequest();
                    setIsInputting(false);
                }
            }, 2000);
        }

        const handleFocusOut = (e: FocusEvent) => {
            dispatch(setAmount(fromValue));
        };
        fromInput.current?.addEventListener('focusout', handleFocusOut);

        const handleKeyDown = (e: KeyboardEvent) => {
            setIsInputting(true);
            if (e.key == 'Enter') {
                dispatch(setAmount(fromValue));
            }
        };
        fromInput.current?.addEventListener('keydown', handleKeyDown);

        // cleanup function to remove event listeners
        return () => {
            fromInput.current?.removeEventListener('focusout', handleFocusOut);
            fromInput.current?.removeEventListener('keydown', handleKeyDown);
            timeoutRef.current && clearTimeout(timeoutRef.current);
        };
    }, [fromValue]);

    useEffect(() => {
        if (!fromValue || swapToken.from == 'notChoose' || swapToken.to == 'notChoose') return setToValue(0);
        exchangeRequest();
        setIsInputting(false);
    }, [swapToken]);

    useEffect(() => {
        if (modal.request && modal.type == 'slippage') {
            dispatch(modalAsync({ ...modal, promiseFunc: swapRequest() }));
        }
    }, [modal.request]);

    const swapRequest = async () => {
        let curRate: string | number = ((toValue * 100) / fromValue).toString();
        curRate = parseInt(curRate);
        console.log(curRate);
        let status = '';
        const { data } = await axios.post('http://13.125.251.97:8080/api/contract/swap', {
            ...swapToken,
            slippage: slippage.value,
            account: web3.account,
            rate: curRate,
        });

        if (data.buyObj) {
            if (web3.web3) {
                try {
                    const buy = await web3?.web3.eth.sendTransaction(data.buyObj);

                    console.log(buy);

                    const { data: saveData } = await axios.post('http://13.125.251.97:8080/api/swap/save', {
                        ...buy,
                        amount: swapToken.amount,
                        type: 'Swap',
                    });
                    status = 'success';
                    console.log(saveData);
                } catch (error) {
                    status = 'fail';
                    console.error(error);
                }
            }
        } else {
            if (web3.web3) {
                try {
                    const approve = await web3.web3.eth.sendTransaction(data.approveObj);
                    console.log(approve);
                    const sell = await web3.web3.eth.sendTransaction(data.sellObj);
                    console.log(sell);

                    const { data: saveData } = await axios.post('http://13.125.251.97:8080/api/swap/save', {
                        ...sell,
                        amount: swapToken.amount,
                        type: 'Swap',
                    });
                    status = 'success';
                    console.log(saveData);
                } catch (error) {
                    status = 'fail';
                    console.error(error);
                }
            }
        }
        dispatch(modalRequest(false));
        dispatch(modalClose());
        dispatch(tokenSwapFrom('notChoose'));
        dispatch(tokenSwapTo('HUT'));
        dispatch(setAmount(0));
        setToValue(0);
        getBalance(account);
        if (fromInput && fromInput.current) fromInput.current.value = '';
        return status;
    };

    const exchangeRequest = async () => {
        if (!isInputting) return;
        try {
            const {
                data: { conversion, percent = 0, tokenExchange },
            } = await axios.get('http://13.125.251.97:8080/api/swap/exchange', {
                params: {
                    ...swapCheckData,
                },
            });
            setToValue(() => conversion);
            setExchangePercent(percent);
            setTokenExchange(tokenExchange);

            return conversion;
        } catch (error) {
            return error;
        }
    };

    const FromToExchange = () => {
        const tempFrom = swapToken.from;
        const tempTo = swapToken.to;
        dispatch(tokenSwapFrom(tempTo));
        dispatch(tokenSwapTo(tempFrom));
    };

    const maxValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxValue = swapToken.from == 'matic' ? +accountBalance.MATIC : +accountBalance.HUT;
        let inputValue = parseFloat(e.target.value);

        if (inputValue > maxValue) {
            inputValue = maxValue;
        }

        setFromValue(+inputValue);
    };

    return (
        <SwapDiv>
            <div className="bg-darkgrey">
                <div>
                    <div className="FromToText">
                        <div>
                            <span>From</span>
                        </div>
                    </div>
                    <SwapContent>
                        <div>
                            <input
                                ref={fromInput}
                                className="fromInput winStyle-fontGradient fg-gold ac-orange"
                                style={{ fontSize: '20px', fontWeight: '700' }}
                                type="number"
                                name="fromValue"
                                onChange={(e) => {
                                    maxValue(e);
                                }}
                                value={+fromValue}
                                min="0"
                                max={swapToken.from}
                                step="0.001"
                            />
                        </div>
                        <div>
                            <div>
                                <Image src="/img/arrow.svg" alt="Token Logo" width={10} height={10} />
                            </div>
                            <div
                                className="fromTokenImg"
                                onClick={() => {
                                    setModalTypeFunction('selectTokenFrom');
                                }}
                            >
                                <Image src={`/img/${swapToken.from}.svg`} alt="Token Logo" width={30} height={30} />
                            </div>
                        </div>
                    </SwapContent>
                    <AmountToken>
                        <div>
                            <div>보유</div>
                            <div>
                                {swapToken.from == 'matic'
                                    ? accountBalance.MATIC
                                    : swapToken.from == 'HUT'
                                    ? accountBalance.HUT
                                    : 0}
                            </div>
                        </div>
                        <div>{swapToken.from != 'notChoose' ? swapToken.from.toUpperCase() : 'Token'}</div>
                    </AmountToken>
                </div>
                <div className="exchnageImg">
                    <Image
                        onClick={() => {
                            FromToExchange();
                        }}
                        src="/img/exchange.svg"
                        alt="Token Logo"
                        width={30}
                        height={30}
                    />
                </div>
                <div>
                    <div className="FromToText">
                        <div>
                            <span>To</span>
                        </div>
                    </div>
                    <SwapContent>
                        <div>
                            <div
                                className="toInput winStyle-fontGradient fg-gold ac-orange"
                                style={{ fontSize: '20px', fontWeight: '700' }}
                            >
                                {toValue}
                            </div>
                        </div>
                        <div>
                            <div>
                                <Image src="/img/arrow.svg" alt="Token Logo" width={10} height={10} />
                            </div>
                            <div
                                className="toTokenImg"
                                onClick={() => {
                                    setModalTypeFunction('selectTokenTo');
                                }}
                            >
                                <Image src={`/img/${swapToken.to}.svg`} alt="Token Logo" width={30} height={30} />
                            </div>
                        </div>
                    </SwapContent>
                    <AmountToken>
                        <div>
                            <div>보유</div>
                            <div>
                                {' '}
                                {swapToken.to == 'matic'
                                    ? accountBalance.MATIC
                                    : swapToken.to == 'HUT'
                                    ? accountBalance.HUT
                                    : 0}
                            </div>
                        </div>
                        <div>{swapToken.to != 'notChoose' ? swapToken.to.toUpperCase() : 'Token'}</div>
                    </AmountToken>
                </div>
            </div>
            <TokenChoose className="swapStyle-LR bg-orange ac-gold">
                {swapToken.from == 'notChoose' || swapToken.to == 'notChoose' ? (
                    <div>토큰을 선택해주세요</div>
                ) : (
                    <div></div>
                )}
                <div
                    className="swapBtn"
                    onClick={() => {
                        if (swapToken.from == 'notChoose' || swapToken.to == 'notChoose' || !swapToken.amount) return;
                        setModalTypeFunction('slippageNotice');
                    }}
                >
                    Swap
                </div>
            </TokenChoose>
        </SwapDiv>
    );
};

export default SwapBox;

const SwapDiv = styled.div`
    & .exchnageImg {
        margin-top: 50px;
        & > img {
            cursor: pointer;
        }
    }
    & .exchnageImg + div {
        margin-bottom: 50px;
    }
    width: 50%;
    filter: drop-shadow(0 0 1.5rem #41414150);
    border-radius: 10px;
    margin: auto;
    display: flex;
    font-weight: 700;

    & .FromToText {
        position: relative;
        top: -10px;
        margin-top: 0;
        & > div:first-child {
            border-bottom: 1px solid var(--grey);
        }
        & > div {
            min-height: 3rem;
            line-height: 3rem;
            & > span {
                width: auto;
            }
            &:first-child {
                color: var(--gold);
                font-size: 1.3rem;
            }
            &:last-child {
                position: relative;
                top: 0px;
            }
        }
    }

    & > div {
        padding: 0.6rem 3rem;
        & > div {
            margin: 10px 0;

            & > div {
                color: #9e9e9e;

                margin: 20px 0;
            }
        }
        & > div:nth-child(2) {
            display: flex;

            justify-content: flex-end;
        }
    }

    & > div:first-child {
        border-radius: 10px 0px 0px 10px;
        width: 90%;
        & > div:nth-child(2) {
            & > img {
            }
        }
    }
    & > div:nth-child(2) {
        border-radius: 0px 10px 10px 0px;
    }
`;

const SwapContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    & > div:first-child {
        width: 80%;
        background-color: var(--darkgrey);
        border-radius: 10px;
    }
    & > div:nth-child(2) {
        display: flex;
        column-gap: 10px;
        align-items: center;
    }
    & .fromInput {
        outline: none;
        border: none;
        border-radius: 10px;
        padding: 5px;
        width: 100%;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        &:focus {
            color: white;
            outline: none;
            box-shadow: none;
        }
        &::after {
        }
    }
    & .toInput {
        border-radius: 10px;
        display: flex;
        width: 100%;

        padding: 5px;
    }
    & .fromTokenImg,
    & .toTokenImg {
        cursor: pointer;
    }
`;

const AmountToken = styled.div`
    display: flex;
    justify-content: space-between;

    & > div:first-child {
        display: flex;
        column-gap: 10px;

        & > div {
            color: #9e9e9e;
        }
    }
    & > div {
        font-weight: 500;
    }
`;
const TokenChoose = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 25%;
    & > div {
        width: 100%;
        padding: 20px 0;
    }
    .swapBtn {
        cursor: pointer;
        &:hover {
            color: var(--dark);
        }
    }
`;
