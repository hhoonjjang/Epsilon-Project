import styled from 'styled-components';
import { useState, useEffect } from 'react';
import IBatchContents from '@/interface/IBatch.interface';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { modalAsync } from '@/module/features/modalSlice';
import BatchDurationBox from './BatchDurationBox';
import BatchAmountBox from './BatchAmountBox';
import PictureImg from '../Picture/PicutreImg';

const BatchContentsCard = ({
    data,
    account,
    web3,
    durationData,
}: {
    data: [] | [obj: IBatchContents];
    account: string;
    web3: any;
    durationData: number[];
}) => {
    const [stakeAmount, setStakeAmount] = useState<number[]>([]);
    const [stakeDuration, setStakeDuration] = useState<number[]>([]);
    const [checkedTokens, setCheckedTokens] = useState<number[]>([]);
    const [checkedTokenPrice, setCheckedTokenPrice] = useState<number[]>([]);

    const modal = useAppSelector((state) => state.modal);
    const dispatch = useAppDispatch();

    interface batchData {
        tokenId: number[];
        price: number[];
        duration: number[];
        amount: number[];
        account: string;
    }

    const handleCheckToken = (e: React.ChangeEvent<HTMLInputElement>, tokenPrice: number) => {
        const tokenId = parseInt(e.target.value, 10);

        if (e.target.checked) {
            setCheckedTokens((prevTokens) => [...prevTokens, tokenId]);
            setCheckedTokenPrice((prevPrice) => [...prevPrice, tokenPrice]);
            setStakeAmount((prevAmount) => [...prevAmount, 0]);
            setStakeDuration((prevDuration) => [...prevDuration, durationData[0]]);
        } else {
            let tokenIdx: number = checkedTokens.findIndex((item) => item == tokenId);
            setCheckedTokenPrice((state) => (state = [...state.slice(0, tokenIdx), ...state.slice(tokenIdx + 1)]));
            setStakeAmount((state) => (state = [...state.slice(0, tokenIdx), ...state.slice(tokenIdx + 1)]));
            setStakeDuration((state) => (state = [...state.slice(0, tokenIdx), ...state.slice(tokenIdx + 1)]));
            setCheckedTokens((prevTokens) => prevTokens.filter((t) => t !== tokenId));
        }
    };

    const sendBatchData = async (data: batchData) => {
        let status = '';
        try {
            const batchData = (await axios.post('http://13.125.251.97:8080/api/contract/batchStaking', data)).data;
            console.log('batchData', data);
            console.log('batchObject', batchData);
            if (web3.web3) {
                const approveObject = await web3.web3.eth.sendTransaction(batchData.approveObj);
                console.log('approveObject', approveObject);
                const stakeBatchObject = await web3.web3.eth.sendTransaction(batchData.stakeBatchObj);
                console.log('stakeObject', stakeBatchObject);
                await axios.post('http://13.125.251.97:8080/api/staking/batchStakeSave', {
                    stakeList: data,
                    transaction: stakeBatchObject,
                });
            }
            status = 'success';
        } catch (err) {
            status = 'fail';
            return err;
        }
        return status;
    };

    return (
        <BatchCardOutter>
            <div>
                <div>NFT</div>
                <div>가격</div>
                <div>수량</div>
                <div>예치 기간 (개월)</div>
                <div>예치</div>
            </div>

            {data?.map((item: IBatchContents, index: number) => {
                item.price ? item.price : (item.price = 1);
                return (
                    <BatchContentsBox key={`batchBox-${index}`}>
                        <div key={`nftName-${index}`}>
                            <div>
                                {/* <img src={item.nft.img} width={'50px'} style={{ borderRadius: '0.6rem' }} /> */}
                                <PictureImg imgSrc={item.nft.img} size={'small'} width={50} />
                            </div>
                            <div>
                                {item.nft.name} #{item.tokenId}
                            </div>
                        </div>
                        <div key={`price-${index}`}>{item.price}</div>
                        <div key={`amount-${index}`}>
                            <BatchAmountBox
                                item={item}
                                checking={checkedTokens.includes(item.tokenId)}
                                checkedTokens={checkedTokens}
                                setStakeAmount={setStakeAmount}
                            />
                        </div>
                        <DurationDiv className={'si'} key={`duration-${index}`}>
                            <BatchDurationBox
                                setStakeDuration={setStakeDuration}
                                checking={checkedTokens.includes(item.tokenId)}
                                checkedTokens={checkedTokens}
                                tokenId={item.tokenId}
                                durationData={durationData}
                            />
                        </DurationDiv>
                        <div key={`checkbox${index}`}>
                            <input
                                type="checkbox"
                                name="stake-token"
                                value={item.tokenId}
                                checked={checkedTokens.includes(item.tokenId)}
                                onChange={(e) => {
                                    handleCheckToken(e, item.price);
                                }}
                            />
                        </div>
                    </BatchContentsBox>
                );
            })}
            <div
                onClick={() => {
                    if (stakeAmount.length < 1) return;
                    console.log({
                        tokenId: checkedTokens,
                        price: checkedTokenPrice,
                        duration: stakeDuration,
                        amount: stakeAmount,
                        account,
                    });
                    dispatch(
                        modalAsync({
                            ...modal,
                            promiseFunc: sendBatchData({
                                tokenId: checkedTokens,
                                price: checkedTokenPrice,
                                duration: stakeDuration,
                                amount: stakeAmount,
                                account,
                            }),
                        })
                    );
                }}
            >
                <div>일괄 예치</div>
            </div>
        </BatchCardOutter>
    );
};

export default BatchContentsCard;

const BatchCardOutter = styled.div`
    width: 100%;

    border: 2px solid var(--light);
    border-radius: 5px;

    & > div {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        align-items: center;
        & > div:first-child {
            width: 25%;
        }
        & > div:nth-child(2) {
            width: 20%;
        }
        & > div:nth-child(3) {
            width: 20%;
        }
        & > div:nth-child(4) {
            width: 30%;
        }
        & > div:nth-child(5) {
            width: 5%;
            text-align: right;
        }
    }
    & > div:nth-child(2) {
        border-top: 2px solid var(--light);
        color: var(--lightgrey);
    }
    & > div:nth-child(n + 3) {
        border-top: 1px solid var(--lightgrey);
        color: var(--lightgrey);
    }
    & > div:last-child {
        :hover {
            cursor: pointer;
            color: var(--gold);
        }
        & > div {
            width: fit-content;
        }
        justify-content: center;
        color: var(--light);
    }
`;

const BatchContentsBox = styled.div`
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    & > div:first-child {
        display: flex;
        align-items: center;
        column-gap: 10px;
    }

    & > div:nth-child(3) {
        > input {
            width: 30%;
            color: var(--white);
            background-color: var(--dark);

            border: none;
        }
    }
    & > div:last-child > input {
        width: 20px;
        height: 20px;

        cursor: pointer;
    }
    img {
        width: 50px;
        border-radius: 0.6rem;
    }
`;

const DurationDiv = styled.div`
    display: flex;
    column-gap: 20px;
    & > div {
        display: flex;
        justify-content: center;
        width: 15%;
        border: 1px solid var(--lightgrey);
        border-radius: 0.6rem;
        padding: 10px;
    }

    .hoverOn:hover {
        cursor: pointer;
        border: 1px solid var(--gold);
        color: var(--gold);
    }
    .on {
        border: 1px solid var(--gold);
        color: var(--gold);
    }
`;
