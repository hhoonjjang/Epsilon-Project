import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { useState } from 'react';
import { modalClose } from '@/module/features/modalSlice';
import { tokenSwapFrom, tokenSwapTo } from '@/module/features/swapTokenSelectedSlice';

const SelectToken = ({ dir }: { dir: string }) => {
    const swapToken = useAppSelector((state) => state.swapToken);
    const balance = useAppSelector((state) => state.balance);
    const [token, setToken] = useState('notChoose');
    const [tokenInput, setTokenInput] = useState<string>('');
    const arr = [{ name: 'matic' }, { name: 'HUT' }];
    // 이런식으로 백에서?? 지갑 정보를 가져와야함
    const filterArr = arr.filter((item) => (dir == 'from' ? item.name != swapToken.to : item.name != swapToken.from));

    const dispatch = useAppDispatch();
    const setSwap = (_state: string) => {
        dir == 'from' ? dispatch(tokenSwapFrom(_state)) : dispatch(tokenSwapTo(_state));
    };
    const modalCloseFunction = () => {
        dispatch(modalClose());
    };

    return (
        <>
            <SelectTokenBox>
                <InputBox>
                    <div>
                        <div>
                            <img src="/img/ReadingGlasses.svg" alt="" />
                        </div>
                        <input
                            type="text"
                            placeholder="코인명, 토큰 검색"
                            onInput={(e) => {
                                setTokenInput(e.currentTarget.value);
                            }}
                            value={tokenInput}
                        />
                    </div>
                    <div>
                        <div></div>
                        <div>보유자산만</div>
                    </div>
                </InputBox>
                <TokenBox>
                    <div>
                        <div>토큰</div>
                        <div>보유</div>
                    </div>
                    <div>
                        {filterArr
                            .filter((item) => item.name.toUpperCase().includes(tokenInput.toUpperCase()))
                            .map((item, index) => {
                                return (
                                    <div
                                        key={`outter-${index}`}
                                        className={
                                            item.name == 'matic' && token == 'matic'
                                                ? 'choosen'
                                                : item.name == 'HUT' && token == 'HUT'
                                                ? 'choosen'
                                                : ''
                                        }
                                        onClick={() => {
                                            setToken(item.name);
                                        }}
                                    >
                                        <div>
                                            <img src={`/img/${item.name}.svg`} alt="" />
                                            <p>{item.name.toUpperCase()}</p>
                                        </div>
                                        <div>{item.name == 'matic' ? balance.MATIC : balance.HUT}</div>
                                    </div>
                                );
                            })}
                    </div>
                </TokenBox>
            </SelectTokenBox>
            <ModalBtnBox>
                <div onClick={modalCloseFunction}>취소</div>
                <div
                    onClick={() => {
                        setSwap(token);
                        modalCloseFunction();
                    }}
                >
                    확인
                </div>
            </ModalBtnBox>
        </>
    );
};

export default SelectToken;

const SelectTokenBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    /* border-bottom: 1px solid var(--grey); */
`;

const InputBox = styled.div`
    width: 100%;
    border-bottom: 1px solid var(--grey);
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    & > div:first-child {
        display: flex;
        column-gap: 10px;
        width: 70%;
        border-right: 1px solid var(--grey);
    }
    & > div:last-child {
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 10px;
        & > div {
            color: var(--lightgrey);
            font-size: 12px;
        }
        & > div:first-child {
            width: 18px;
            height: 18px;
            border-radius: 5px;
            border: 1px solid var(--grey);
        }
    }
    input {
        width: 100%;
        border: 0 solid transparent;
        background-color: transparent;
        color: var(--white);
        &:focus {
            outline: none;
        }
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
`;

const TokenBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    & > div:first-child {
        padding: 25px 0;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        line-height: 17px;
        color: var(--lightgrey);
    }
    & > div:not(:first-child) {
        display: flex;
        flex-direction: column;
        row-gap: 12px;
        cursor: pointer;

        & > div {
            display: flex;
            justify-content: space-between;
            border: 1px solid var(--grey);
            & > div {
                width: 100%;
                display: flex;
                padding: 10px 10px;
                align-items: center;
                column-gap: 10px;
            }
            & > div:last-child {
                justify-content: end;
            }
            &:hover {
                border: 1px solid var(--gold);
            }
            &:active {
                border: 1px solid var(--grey);
            }
        }
    }

    p,
    img {
        font-size: 14px;
        background-color: transparent;
    }

    & div.choosen {
        border: 1px solid var(--gold) !important;
    }
`;
const ModalBtnBox = styled.div`
    width: 113%;
    display: flex;
    justify-content: space-between;
    & > div {
        width: 50%;
        padding: 20px 0;
        text-align: center;
        border: 1px solid var(--grey);
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
        font-size: 15px;
        font-weight: 600;
        &:hover {
            color: var(--bg);
            background: linear-gradient(90deg, #ffd740 0%, #ffab00 100%);
            cursor: pointer;
        }
    }
`;
