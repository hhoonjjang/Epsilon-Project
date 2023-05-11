import styled from 'styled-components';
import Image from 'next/image';
import ITokenExchange from '@/interface/ITokenExchange.interface';
import { useAppSelector } from '@/hooks/reduxHook';
import { useEffect, useState } from 'react';

interface FeeExpected {
    exchangePercent: Number;
    tokenExchange: ITokenExchange;
}
interface tokenData {
    amount: number;
    from: string;
    to: string;
}

const FeeExpected = ({ exchangePercent, tokenExchange: { from, to, conversion, toUSD } }: FeeExpected) => {
    const KlayToHUT = (_text: string) => {
        return _text == 'KLAY' ? 'HUT' : _text.toUpperCase();
    };
    const [token, setToken] = useState<tokenData>({ amount: 0, from: '', to: '' });
    const tokenData = useAppSelector((state) => state.swapToken);
    useEffect(() => {
        setToken((state) => (state = tokenData));
    }, [tokenData.amount, tokenData.to]);
    return (
        <FeeDiv>
            <div>
                <div style={{ fontWeight: '600' }} className="fg-lightgrey">
                    예상금액
                </div>
                <div className="winStyle-info" data-text={'예상금액 Info'}>
                    <Image src="/img/questionMark.svg" alt="Question Mark" width={19} height={19} />
                </div>
            </div>
            <div>
                <div>
                    <div className="fg-lightgrey">교환 비율(가격)</div>
                    <div className="winStyle-info" data-text={'교환 비율 Info'}>
                        <Image src="/img/questionMark.svg" alt="Question Mark" width={16} height={16} />
                    </div>
                </div>
                <PriceDiv>
                    <div>
                        1 {KlayToHUT(from)} ≈ {conversion} {KlayToHUT(to)} <p> (${toUSD}) </p>
                    </div>
                    <div>
                        현재 비율 대비 차이 <p>{`${exchangePercent.toFixed(4)}%`}</p>
                    </div>
                </PriceDiv>
            </div>
            <div>
                <div>
                    <div className="fg-lightgrey">최대 전송 수량</div>
                    <div className="winStyle-info" data-text={'최대 전송 수량 Info'}>
                        <Image
                            className="winStyle-info"
                            src="/img/questionMark.svg"
                            alt="Question Mark"
                            width={16}
                            height={16}
                            data-text={'image1'}
                        />
                    </div>
                </div>

                <div>
                    <div>
                        {' '}
                        {''}
                        {from && `10000000 ${KlayToHUT(from)}`}
                    </div>
                    <div>슬리피지 0.5%</div>
                </div>
            </div>
            <div>
                <div>
                    <div className="fg-lightgrey">수수료</div>
                    <div className="winStyle-info" data-text={'수수료 Info'}>
                        <Image src="/img/questionMark.svg" alt="Question Mark" width={16} height={16} />
                    </div>
                </div>
                <div>
                    <div>
                        {(token.amount * 3) / 100} {token.from == 'notChoose' ? '' : token.from.toUpperCase()}
                    </div>
                </div>
            </div>
        </FeeDiv>
    );
};

export default FeeExpected;

const FeeDiv = styled.div`
    width: 50%;
    margin: auto;

    & > div:first-child {
        display: flex;
        justify-content: flex-start;
        column-gap: 10px;
        font-size: 14px;
        color: #9e9e9e;
    }
    & > div {
        margin: 20px 0;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        & > div:first-child {
            display: flex;
            column-gap: 10px;
        }

        & > div:nth-child(2) {
            & > div {
                margin: 10px 0;
                text-align: right;
            }
        }
    }
    & div:nth-child(2) > div {
        color: #bdbdbd;
    }
`;

const PriceDiv = styled.div`
    & > div:first-child {
        display: flex;
        justify-content: end;
        column-gap: 0.3rem;
        & > p {
            color: #ffab00;
        }
    }
    & > div:nth-child(2) {
        display: flex;
        column-gap: 0.3rem;
        justify-content: flex-end;
        & > p {
            color: #2979ff;
        }
    }
`;
