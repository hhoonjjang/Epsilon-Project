import styled from 'styled-components';
import Link from 'next/link';
import { modalAsync } from '@/module/features/modalSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { IAllClaimData, IClaimAbleTokenItem } from '@/interface/INftUpper.interface';
import { useState } from 'react';
import dateFormat from '@/module/features/dateFormation';

const NftUpper = ({
    allClaimData,
    claimAbleToken,
    account,
    batchClaimRequest,
}: {
    allClaimData: IAllClaimData;
    claimAbleToken: Array<IClaimAbleTokenItem> | undefined;
    account: string;
    batchClaimRequest: () => Promise<string | void>;
}) => {
    const dispatch = useAppDispatch();
    const modal = useAppSelector((state) => state.modal);
    const [batchHover, setBatchHover] = useState<number>(0);
    const [claimHover, setclaimHover] = useState<number>(0);
    console.log(typeof claimAbleToken, claimAbleToken, '나는 관련 데이터');

    return (
        <NftsUpperDiv>
            <UpperStyleDiv>
                <div>
                    <div>
                        보상 금액 : {allClaimData.earnedReward}
                        <p className="winStyle-fontGradient fg-gold ac-orange">HUT</p>
                    </div>{' '}
                    <div>수령 가능한 NFT : {allClaimData.claimsAmount} items </div>
                </div>
                <div>
                    <Link href={'/nfts/batch'}>일괄 STAKE 하기</Link>
                </div>
            </UpperStyleDiv>
            <UnderStyleDiv>
                <div>
                    <div>
                        <div>NFT</div>
                        <div>예치일</div>
                        <div>예치량</div>
                        <div>보상 가격</div>
                    </div>
                    {claimAbleToken?.map((item, index) => {
                        let newtime = dateFormat(+item.startTime);
                        return (
                            <div key={`token-map${index}`}>
                                <div>{item.tokenId}</div>
                                <div>{newtime}</div>
                                <div>{item.amount} EA</div>
                                <div>
                                    {item.reward} <p className="winStyle-fontGradient fg-gold ac-orange">HUT</p>
                                </div>
                            </div>
                        );
                    })}
                    <div
                        onClick={() => {
                            if (account)
                                dispatch(
                                    modalAsync({
                                        ...modal,
                                        promiseFunc: batchClaimRequest(),
                                    })
                                );
                        }}
                    >
                        모두 수령하기
                    </div>
                </div>
            </UnderStyleDiv>
        </NftsUpperDiv>
    );
};

const NftsUpperDiv = styled.div`
    flex-direction: column;
    & > div:first-child {
        width: 100%;
    }
    & > div:last-child {
        width: 100%;
    }
`;

const UpperStyleDiv = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
    & > div > div {
        padding: 10px;
        margin: 10px;
        border: 1px solid var(--light);
        border-radius: 10px;
    }
    & > div:first-child {
        display: flex;
    }
    & > div:nth-child(2) {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        margin: 10px;
        border: 1px solid var(--light);
        border-radius: 10px;
        height: fit-content;

        & > a {
            text-decoration: none;
            color: var(--light);

            :hover {
                color: var(--light);
                cursor: pointer;
                background: linear-gradient(
                    -30deg,
                    var(--gold) 0%,
                    var(--gold) 40%,
                    var(--light) 50%,
                    var(--gold) 57%,
                    var(--orangelight) 100%
                );
                background-clip: text;
                -webkit-text-fill-color: transparent;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }
`;

const UnderStyleDiv = styled.div`
    text-align: center;
    & > div {
        width: 70%;
        margin: auto;
        border: 1px solid var(--light);
        border-radius: 10px;
        & > div {
            display: flex;
            justify-content: space-between;
            padding: 10px 20px;
            border-bottom: 1px solid var(--light);
            & > div:first-child {
                width: 20%;
                text-align: left;
            }
            & > div:nth-child(n + 2):nth-child(-n + 3) {
                width: 30%;
            }

            & > div:last-child {
                width: 20%;
                text-align: right;
            }
        }
        & > div:last-child {
            display: flex;
            justify-content: center;
            padding: 10px 20px;
            border-bottom: none;

            & > div {
                width: 33%;
                text-align: left;
            }
            & > div:last-child {
                width: 20%;
                text-align: right;
            }
            :hover {
                color: var(--gold);
                cursor: pointer;
                background: linear-gradient(
                    180deg,
                    var(--gold) 0%,
                    var(--gold) 40%,
                    var(--light) 50%,
                    var(--gold) 57%,
                    var(--orangelight) 100%
                );
                background-clip: text;
                -webkit-text-fill-color: transparent;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
        }
    }
`;

export default NftUpper;
