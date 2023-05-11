import styled from 'styled-components';
import CountdownClock from './CountdownClock';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useObserver } from '@/hooks/useObserver';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { modalType, modalAsync } from '@/module/features/modalSlice';
import { setTokenId, setPrice } from '@/module/features/stakeSlice';
import axios from 'axios';
import { setRewardOn } from '@/module/features/rewardSlice';
import { getDate, roundNumber } from '@/module/tools';
import blurImage from 'public/img/BlurImage.jpg';
import Image from 'next/image';
import PictureImg from './Picture/PicutreImg';
import { Dispatch, SetStateAction } from 'react';

interface IProps {
    name: string;
    img: string;
    tokenId: number;
    earned: number;
    price: number;
    amount: number;
    web3: any;
    account: string;
    stakeAble: boolean;
    deadLine: number;
    status: string;
    blockTime?: number;
    claimStakeId?: string;
    isFetching?: boolean;
    setClaimStateChanger: Dispatch<SetStateAction<boolean>>;
}

const StakeCard = ({
    web3,
    account,
    name,
    img,
    tokenId,
    earned,
    price,
    amount,
    stakeAble,
    deadLine,
    status,
    blockTime,
    claimStakeId,
    isFetching,
    setClaimStateChanger,
}: IProps) => {
    const target = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [ready, setReady] = useState<boolean>(false);
    const [afterLoad, setAfterLoad] = useState<boolean>(false);
    const modal = useAppSelector((state) => state.modal);
    const dispatch = useAppDispatch();
    const REWARDTIMESEC = 3;
    const onIntersect: IntersectionObserverCallback = ([entry]) =>
        entry.isIntersecting ? setVisible(true) : setVisible(false);

    useObserver({
        target,
        onIntersect,
        threshold: 0,
    });

    useEffect(() => {
        if (deadLine > Date.now() || status !== 'staking') {
            setReady(false);
        } else {
            setReady(true);
        }
    }, [getDate(Date.now()).second]);

    const claimRequest = async () => {
        let status = '';
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/claim', {
                tokenId,
                startTime: blockTime,
                account,
            });

            if (!web3.web3) return;
            console.log('sendTransaction data', data);

            const claim = await web3.web3.eth.sendTransaction(data.claimObj);
            console.log('claim', claim);

            // 여기
            const { data: saveData } = await axios.post('http://13.125.251.97:8080/api/staking/claimSave', {
                ...claim,
                claimStakeId,
                // stakeValueId,
            });
            status = 'success';
            setClaimStateChanger((state) => !state);
            console.log('저장된 트랜잭션', saveData.createdTransaction);
            console.log('삭제된 스테이크', saveData.deletedStake);
        } catch (error) {
            status = 'fail';
            console.error(error);
        } finally {
            console.log('finally');
            dispatch(setRewardOn(true));
            setTimeout(() => {
                dispatch(setRewardOn(false));
            }, REWARDTIMESEC * 1000);
        }
        return status;
    };

    return (
        <NFTCardOutterBox>
            <NFTCardBox ref={target} stakeAble={stakeAble}>
                {visible && name && (
                    <>
                        <NFTImage>
                            {/* <LazyLoadImage
                                src={afterLoad ? img : 'img/Loading.gif'}
                                alt="위스키이미지"
                                placeholder={
                                    <Image
                                        width={200}
                                        height={200}
                                        src={`${img.split('_')[0]}_${img.split('_')[1].split('.')[0]}-small.${
                                            img.split('_')[1].split('.')[1]
                                        }`}
                                        alt={'위스키홀더이미지'}
                                    />
                                }
                                effect="blur"
                                width={'100%'}
                                height={96}
                                loading="lazy"
                                afterLoad={() => setAfterLoad(true)}
                            /> */}
                            <PictureImg
                                imgSrc={img}
                                size={'medium'}
                                type="lazy"
                                afterLoad={afterLoad}
                                setAfterLoad={setAfterLoad}
                            />
                        </NFTImage>
                        <NFTName>
                            {name || 'Glenfiddich 12 Years'} {`x ${Array.isArray(amount) ? '0' : amount}`}
                        </NFTName>
                        <NFTTokenId>{`#${tokenId}`}</NFTTokenId>
                        <CardInfoList>
                            <li>
                                <div>Earned</div>
                                <div>
                                    <div>{roundNumber(earned, 4)}</div>
                                    <LazyLoadImage
                                        src="/img/HUTIcon.png"
                                        alt="hutIcon"
                                        placeholder={<LazyPlaceHolderBox></LazyPlaceHolderBox>}
                                    />
                                </div>
                            </li>
                            <li>
                                <div>Price</div>
                                <div className="winStyle-fontGradient fg-gold ac-orange">{roundNumber(price, 4)}</div>
                            </li>
                            <li>
                                <div>Locking Ends :</div>
                            </li>
                        </CardInfoList>
                        <LockingEndsTimer>
                            <li>{<CountdownClock deadLine={deadLine} unit="day" />}</li>
                            <li>{<CountdownClock deadLine={deadLine} unit="hour" />}</li>
                            <li>{<CountdownClock deadLine={deadLine} unit="minute" />}</li>
                            <li>{<CountdownClock deadLine={deadLine} unit="second" />}</li>
                        </LockingEndsTimer>
                        <StakeBtnBox>
                            <div
                                className={`winStyle-button ${stakeAble ? 'on' : 'off'} ${
                                    !stakeAble && status == 'staking' && deadLine > Date.now() ? 'unStake' : ''
                                }`}
                                data-title={`${
                                    stakeAble
                                        ? 'Stake'
                                        : status == 'staking' && deadLine > Date.now()
                                        ? 'UnStake'
                                        : 'Staked'
                                }`}
                                onClick={() => {
                                    stakeAble ? dispatch(modalType('duration')) : dispatch(modalType('unStake'));
                                    dispatch(setTokenId(tokenId));
                                    dispatch(setPrice(price));
                                }}
                            >
                                {`${stakeAble ? 'Stake' : 'UnStake'}`}
                            </div>
                            <div
                                className={`winStyle-button ${ready ? 'on' : 'off'}`}
                                data-title={'Claim'}
                                onClick={() => {
                                    dispatch(modalAsync({ ...modal, promiseFunc: claimRequest() }));
                                }}
                            >
                                Claim
                            </div>
                        </StakeBtnBox>
                    </>
                )}
                {!name && (
                    <LoadingBox>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div>
                            <div></div>
                            <div></div>
                        </div>
                    </LoadingBox>
                )}
            </NFTCardBox>
        </NFTCardOutterBox>
    );
};

export default StakeCard;

interface INFTCardBox {
    stakeAble: Boolean;
}

const NFTCardOutterBox = styled.div``;

const NFTCardBox = styled.div<INFTCardBox>`
    display: inline-block;
    width: 100%;
    padding: 18px;
    border: ${(props) => (props.stakeAble ? '1px solid var(--grey)' : '')};
    border-radius: 20px;
    font-weight: 500;
    min-height: 590px;
    animation: ${(props) => (props.stakeAble ? '' : 'animatedgradient 3s ease alternate infinite')};
    @keyframes animatedgradient {
        0% {
            box-shadow: 0 0 0 2px #ff8f00;
        }
        50% {
            box-shadow: 0 0 0 2px #ffd740;
        }
        100% {
            box-shadow: 0 0 0 2px #ff8f00;
        }
    }
`;

const NFTImage = styled.div`
    width: 100%;
    border-radius: 20px;
    margin-bottom: 26px;
    img {
        width: 100%;
        height: 280px;
        border-radius: 7px;
        min-height: 280px;
    }
`;

const NFTName = styled.div`
    font-size: 1rem;
    font-weight: 700;
    color: var(--light);
`;

const NFTTokenId = styled.div`
    margin: 10px 0px;
    font-size: 1rem;
    color: var(--lightgrey);
`;

const CardInfoList = styled.ul`
    margin-top: 20px;
    list-style: none;
    display: flex;
    flex-direction: column;
    width: 100%;
    & > li:not(:last-of-type) {
        border-bottom: 1px solid var(--dark);
    }
    & > li {
        padding: 10px 0;
        font-size: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div {
            color: var(--lightgrey);
            display: flex;
            img {
                margin-left: 7px;
                height: 1rem;
            }
        }
    }
`;

const LockingEndsTimer = styled.ul`
    list-style: none;
    display: flex;
    align-items: center;
    margin: 10px 0px;
    width: 100%;
    column-gap: 4%;
    li {
        width: 22%;
        border: 1px solid var(--dark);
        border-radius: 10px;
    }
`;

const StakeBtnBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    & > div {
        padding: 15px 0;
        width: 45%;
        font-size: 0.8rem;
    }
    & > div.on {
        &::before {
            background: var(--border-gradient);
        }
        color: var(--gold);
    }
    & .off:not(.unStake) {
        pointer-events: none;
    }
    & .unStake {
        &::before {
            background: var(--grey);
        }
    }
`;

const LazyPlaceHolderBox = styled.div`
    width: 100%;
    min-height: 225px;
    background-color: grey;
`;

const LoadingBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    & > div:nth-child(1) {
        width: 100%;
        min-height: 225px;
        border-radius: 20px;
        margin-bottom: 20px;
        animation: colorAnim 1s infinite ease-in-out;
    }
    & > div:nth-child(2) {
        width: 80%;
        height: 30px;
        animation: colorAnim 1s infinite ease-in-out;
        border-radius: 15px;
        margin: 10px 0;
    }
    & > div:nth-child(3) {
        width: 30%;
        height: 30px;
        animation: colorAnim 1s infinite ease-in-out;
        border-radius: 15px;
        margin-bottom: 10px;
    }
    & > div:nth-child(4),
    & > div:nth-child(5),
    & > div:nth-child(6) {
        width: 100%;
        height: 30px;
        animation: colorAnim 1s infinite ease-in-out;
        border-radius: 15px;
        margin-bottom: 10px;
    }
    & > div:nth-child(7) {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        & > div {
            width: 22%;
            height: 30px;
            animation: colorAnim 1s infinite ease-in-out;
            border-radius: 15px;
        }
    }
    & > div:nth-child(8) {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        & > div {
            width: 45%;
            height: 40px;
            animation: colorAnim 1s infinite ease-in-out;
            border-radius: 15px;
        }
    }
    @keyframes colorAnim {
        from {
            background-color: var(--middlegrey);
        }
        50% {
            background-color: var(--grey);
        }
        to {
            background-color: var(--middlegrey);
        }
    }
`;
