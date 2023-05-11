import styled from 'styled-components';
import StakeCard from '@/components/StakeCard';
import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import { useObserver } from '@/hooks/useObserver';
import useLocalStorage from 'use-local-storage';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { modalAsync, modalClose, modalRequest } from '@/module/features/modalSlice';
import SideBar from '@/components/Menu/SideBar';
import Link from 'next/link';
import { getBalanceThunk } from '@/module/features/balanceSlice';
import dayjs from 'dayjs';
import { setDurationAndChargeArray } from '@/module/features/durationAndCharge';
import { IAllClaimData, IClaimAbleToken, IClaimAbleTokenItem } from '@/interface/INftUpper.interface';
import NftUpper from '@/components/NftsUpper/NftUpper';

const OFFSET = 6;

interface IStake {
    name: string;
    img: string;
    tokenId: number;
    earned: number;
    price: number;
    amount: number;
}

const NFTs = ({ web3, account }: { web3: any; account: string }) => {
    const bottom = useRef(null);
    const [scrollY] = useLocalStorage('nft_scrollY', 0);
    const [isInfinite, setIsInfinite] = useState<boolean>(false);
    const [rewardState, setRewardState] = useState<boolean>(false);
    const [clickedObjectId, setClickedObjectId] = useState<string>('');
    const [clickedTokenId, setClickedTokenId] = useState<number>(0);
    const [clickedStakePrice, setClickedStakePrice] = useState<number>(0);
    const [clickedStakeId, setClickedStakeId] = useState<string>('');
    const [clickedUnStakeBlockTime, setClickedStakeBlockTime] = useState<number>(0);
    const [allClaimData, setAllClaimData] = useState<IAllClaimData>({ earnedReward: '0', claimsAmount: '0' });
    const [claimAbleToken, setClaimAbleToken] = useState<IClaimAbleTokenItem[] | undefined>();
    const reward = useAppSelector((state) => state.reward);
    const modal = useAppSelector((state) => state.modal);
    const stake = useAppSelector((state) => state.stake);
    const durationAndCharge = useAppSelector((state) => state.durationAndCharge);
    const getBalance = (_account: string) => dispatch(getBalanceThunk(_account));
    const [fetchFailed, setFetchFailed] = useState<boolean>(false);
    const [claimStateChanger, setClaimStateChanger] = useState<boolean>(true);

    const dispatch = useAppDispatch();

    const getNftList = async ({ pageParam = 0 }) => {
        setFetchFailed(false);
        if (account) {
            const { data } = await axios.get('http://13.125.251.97:8080/api/nft/userNftList', {
                params: {
                    limit: OFFSET,
                    offset: pageParam,
                    userAccount: account,
                },
            });
            console.log(data);
            return data;
        } else {
        }
    };
    const getClaimData = async () => {
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/userSteakDisplay', {
                account,
            });

            setAllClaimData((state) => (state = { earnedReward: data.earnedReward, claimsAmount: data.claimsAmount }));
            setClaimAbleToken((state) => (state = data.claimAbleData));
        } catch (err) {
            console.log(err);
        }
    };

    const getDurations = async () => {
        try {
            // 여기, management schema 생성 이후
            const { data } = await axios.get('http://13.125.251.97:8080/api/admin/duration');
            console.log(data);
            dispatch(
                setDurationAndChargeArray([
                    { duration: data[0].duration, charge: data[0].charge },
                    { duration: data[1].duration, charge: data[1].charge },
                    { duration: data[2].duration, charge: data[2].charge },
                ])
            );
            return data;
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    useEffect(() => {
        if (account) {
            getClaimData();
            getDurations();
        }
    }, [account, claimStateChanger]);

    useEffect(() => {
        window.scrollTo(0, Number(scrollY));
    }, [scrollY]);

    useEffect(() => {
        if (reward.on) {
            setRewardState(true);
        } else {
            setRewardState(false);
        }
    }, [reward]);

    useEffect(() => {
        console.log(clickedObjectId);
    }, [clickedObjectId]);

    const stakeRequest = async () => {
        let status = '';
        try {
            // 금액을 stakeValue에서 가져온 후 staking 트랜잭션 객체 생성 요청을 보내야 함
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/staking', {
                duration: stake.duration,
                tokenId: stake.tokenId,
                amount: stake.amount,
                charge: stake.charge,
                price: clickedStakePrice,
                account: web3.account,
            });
            if (web3.web3) {
                const approveObject = await web3.web3.eth.sendTransaction(data.approveObj);
                console.log('approveObject', approveObject);
                const stakeObject = await web3.web3.eth.sendTransaction(data.stakeObj);
                console.log('stakeObject', stakeObject);
                const curStakeData: IStake = { ...stakeObject };
                const { data: saveData } = await axios.post('http://13.125.251.97:8080/api/staking/save', {
                    ...curStakeData,
                    amount: stake.amount,
                    duration: stake.duration,
                    account: web3.account,
                    objectId: clickedObjectId,
                    stakePrice: clickedStakePrice,
                });
                console.log(saveData);
                setClickedObjectId('');
                setClickedStakePrice(0);
                status = 'success';
            }
        } catch (error) {
            console.error(error);
            status = 'fail';
        }
        return status;
    };

    const batchClaimRequest = async () => {
        let status = '';
        try {
            if (!claimAbleToken?.length) return alert('수령 가능한 NFT가 존재하지 않습니다.');
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/batchClaim', { account });
            const approveObject = await web3.web3.eth.sendTransaction(data.approveObj);
            console.log('approveObject', approveObject);
            const batchClaimObj = await web3.web3.eth.sendTransaction(data.batchClaimObj);
            console.log('stakeObject', batchClaimObj);
            // 여기, 트랜잭션 저장 및 stake table에서 삭제
            console.log('claimAbleToken', claimAbleToken);
            const { data: saveData } = await axios.post('http://13.125.251.97:8080/api/staking/batchClaimSave', {
                account,
                transaction: batchClaimObj,
                stakeList: claimAbleToken,
            });
            console.log('saveData', saveData);
            getClaimData();
            getBalance(account);
            status = 'success';
        } catch (err) {
            status = 'fail';
            console.log(err);
        }
        return status;
    };

    const unStakeRequest = async () => {
        let status = '';
        try {
            const { data: txData } = await axios.post('http://13.125.251.97:8080/api/contract/unStake', {
                tokenId: clickedTokenId,
                startTime: clickedUnStakeBlockTime,
                account: web3.account,
            });
            console.log('txData', txData);

            if (web3.web3) {
                const unStake = await web3.web3.eth.sendTransaction(txData.unStakeObj);
                console.log('unStake', unStake);

                const { data: saveData } = await axios.post('http://13.125.251.97:8080/api/staking/unStakeSave', {
                    // tokenId가 아니라 claim save 할 때 처럼
                    // stake Id를 보내 주어야 함(Stake 스키마에서 없애기 위함)
                    unStakeStakeId: clickedStakeId, // 추가
                    ...unStake,
                });
                console.log('saveData', saveData);
            }

            status = 'success';
        } catch (error) {
            console.error(error);
            status = 'fail';
        }
        return status;
    };

    useEffect(() => {
        if (modal.request && modal.type == 'duration') {
            if (!stake.amount || !stake.duration || !stake.tokenId) {
                dispatch(modalClose());
                dispatch(modalRequest(false));
                return;
            }
            dispatch(modalAsync({ ...modal, promiseFunc: stakeRequest() }));
        } else if (modal.request && modal.type == 'unStake') {
            if (!stake.tokenId) {
                dispatch(modalClose());
                dispatch(modalRequest(false));
                return;
            }
            dispatch(modalAsync({ ...modal, promiseFunc: unStakeRequest() }));
        }
    }, [modal.request]);
    useEffect(() => {
        if (reward.on) {
            setRewardState(true);
        } else {
            setRewardState(false);
        }
    }, [reward]);

    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch } =
        useInfiniteQuery('nftList', getNftList, {
            getNextPageParam: (lastPage) => {
                if (!lastPage) return false;
                const { next } = lastPage;
                if (!next) {
                    return false;
                }
                return Number(next.offset);
            },
        });

    useEffect(() => {
        if (account) {
            refetch();
            console.log('refetch');
        }
    }, [account, refetch]);

    useEffect(() => {
        if (!modal.isOpen) {
            refetch();
        }
    }, [modal.isOpen, refetch]);

    useEffect(() => {
        console.log(fetchFailed);
    }, [fetchFailed]);

    // isIntersecting의 경우에 Dom을 마운트한다.
    const onIntersect = ([entry]: IntersectionObserverEntry[]) => entry.isIntersecting && fetchNextPage();

    useObserver({
        target: bottom,
        onIntersect,
    });

    return (
        <NFTsBox>
            <RewardBox reward={rewardState}>
                <img src="/img/reward.gif" alt="" />
            </RewardBox>
            <SideBar />
            <MainBox>
                <NftUpper
                    account={account}
                    allClaimData={allClaimData}
                    claimAbleToken={claimAbleToken}
                    batchClaimRequest={batchClaimRequest}
                />
                {status === 'loading' && (
                    <div>
                        {[...Array(6)].map((_, index) => (
                            <StakeCard
                                name={''}
                                img=""
                                tokenId={-1}
                                earned={-1}
                                price={-1}
                                amount={-1}
                                web3={web3}
                                account={account}
                                status="success"
                                stakeAble={false}
                                deadLine={-1}
                                setClaimStateChanger={setClaimStateChanger}
                                key={`skeleton-${index}`}
                            ></StakeCard>
                        ))}
                    </div>
                )}
                {status === 'success' &&
                    data.pages.map((group: any, index: number) => {
                        return (
                            <div key={`Card-${index}`}>
                                {group?.result?.map((item: any, index: number) => {
                                    const curPrice =
                                        item.stakeValuePrice ||
                                        (Array.isArray(item.stakeValueAmounts) &&
                                            item.stakeValueAmounts
                                                .filter((filtered: number) => filtered != 0)
                                                .reduce((sum: number, currValue: number) => {
                                                    const curLen = item.stakeValueAmounts.filter(
                                                        (filtered: number) => filtered != 0
                                                    ).length;
                                                    return (sum + currValue) / curLen;
                                                }, 0)) ||
                                        Number(item.stakeValueAverage) ||
                                        10;
                                    const curTempTime = new Date(item.expiredAt * 1000);

                                    const curDeadLine = curTempTime.getTime();

                                    return (
                                        <div
                                            key={`StakeCard-${index}`}
                                            onClick={() => {
                                                setClickedObjectId(item.nft?._id);
                                                setClickedStakePrice(curPrice);
                                                setClickedStakeBlockTime(item.blockTime);
                                                setClickedTokenId(item.tokenId);
                                                setClickedStakeId(item.stake?._id);
                                                console.log(item);
                                                console.log(curDeadLine);
                                            }}
                                        >
                                            <StakeCard
                                                name={item.nft?.name || 'name'}
                                                img={item.nft?.img || '/img/Wiskey.png'}
                                                tokenId={item.nft?.tokenId}
                                                earned={item.reward || curPrice * durationAndCharge[0].charge * 0.01}
                                                price={item.price || curPrice}
                                                amount={item.amount}
                                                web3={web3}
                                                account={account}
                                                stakeAble={
                                                    item.status == 'staking'
                                                        ? false
                                                        : item.status == 'default'
                                                        ? false
                                                        : true
                                                }
                                                deadLine={curDeadLine}
                                                status={item.status}
                                                blockTime={item.blockTime}
                                                claimStakeId={item.stake?._id}
                                                isFetching={isFetching}
                                                setClaimStateChanger={setClaimStateChanger}
                                            ></StakeCard>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                {data && !data.pages[0] && !isFetching && (
                    <NoStakeBox>
                        <div>아직 스테이킹 된 것이 없습니다.</div>
                        <div>스테이킹 하러 가주세요</div>
                    </NoStakeBox>
                )}
                {isFetching && <div>Fetching 중입니다.</div>}
                <MoreBtn
                    data-title={'더 불러오기'}
                    className="winStyle-button"
                    onClick={() => hasNextPage && fetchNextPage()}
                    isInfinite={false}
                >
                    더 불러오기
                </MoreBtn>
                <MoreBtn
                    data-title={'전부 부르기'}
                    className="winStyle-button"
                    onClick={() => setIsInfinite((state) => !state)}
                    isInfinite={true}
                >
                    전부 부르기
                </MoreBtn>
                {isFetchingNextPage && <p>계속 불러오는 중</p>}
                {hasNextPage && isInfinite && <div ref={bottom} />}
            </MainBox>
        </NFTsBox>
    );
};

export default NFTs;

const NFTsBox = styled.div`
    position: relative;
    margin: 0 10%;
    margin-bottom: 150px;
    width: 80%;
    display: flex;
    justify-content: center;
`;

const MainBox = styled.div`
    width: 75%;
    & > div {
        display: inline-flex;
        row-gap: 20px;
        column-gap: 2%;
        flex-wrap: wrap;
        width: 100%;
        margin-bottom: 20px;
        & > div {
            width: 32%;
        }
    }
`;

const MoreBtn = styled.div<{ isInfinite: boolean }>`
    z-index: 10;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: -150px;
    width: 35% !important;
    height: 120px;
    border: 1px solid var(--grey);
    font-size: 1.5rem !important;
    left: ${({ isInfinite }) => (isInfinite ? 'none' : '25%')};
    right: ${({ isInfinite }) => (isInfinite ? '0px' : 'none')};
`;

const RewardBox = styled.div<{ reward: boolean }>`
    display: ${({ reward }) => (reward ? 'flex' : 'none')};
    justify-content: center;
    align-items: center;
    z-index: 999;
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    background-color: rgba(30, 30, 30, 0.6);
`;

const NoStakeBox = styled.div`
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--grey);
    border-radius: 15px;
`;
