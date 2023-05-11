import styled from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useObserver } from '@/hooks/useObserver';
import { useRef, useState } from 'react';
import { roundNumber } from '@/module/tools';
import Image from 'next/image';

import PictureImg from '../Picture/PicutreImg';

interface IProps {
    name: string;
    img: string;
    tokenId: number;
    price: number;
    staked: number;
    amount: number;
}

const MenuCard = ({ name, img, tokenId, price, staked, amount }: IProps) => {
    const target = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [duration, setDuration] = useState<number>(3);
    const [afterLoad, setAfterLoad] = useState<boolean>(false);
    const onIntersect: IntersectionObserverCallback = ([entry]) =>
        entry.isIntersecting ? setVisible(true) : setVisible(false);

    useObserver({
        target,
        onIntersect,
        threshold: 0,
    });

    return (
        <NFTCardBox ref={target}>
            {visible && name && (
                <>
                    <NFTImage afterLoad={afterLoad} className={`${afterLoad && 'blurAnim'}`}>
                        {/* <LazyLoadImage
                            src={afterLoad ? img : 'img/Loading.gif'}
                            alt="위스키이미지"
                            placeholder={
                                <Image
                                    width={96}
                                    height={96}
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
                            size="medium"
                            type="lazy"
                            afterLoad={afterLoad}
                            setAfterLoad={setAfterLoad}
                        />
                    </NFTImage>
                    <NFTName>{name || 'Glenfiddich 12 Years'}</NFTName>
                    <NFTTokenId>{`#${tokenId}`}</NFTTokenId>
                    <CardInfoList>
                        <li>
                            <div>Price</div>
                            <div>
                                <div>{roundNumber(price, 2) || 'Not Sold Yet'}</div>
                                <LazyLoadImage src="/img/HUTIcon.png" alt="hutIcon" />
                            </div>
                        </li>
                        <li>
                            <div>Staked</div>
                            <div className="winStyle-fontGradient fg-gold ac-orange">
                                {roundNumber(price * 0.01 * duration, 4) || 30}
                                <LazyLoadImage src="/img/HUTIcon.png" alt="hutIcon" />
                            </div>
                        </li>
                        <li>
                            <div>Set Duration (Month)</div>
                            <DurationInfo className="winStyle-info" data-text={'expected revenue'}>
                                <LazyLoadImage src="/img/questionMark.svg" />
                            </DurationInfo>
                        </li>
                        <DurationBox>
                            <DurationBtn
                                duration={duration}
                                index={1}
                                className="winStyle-button"
                                data-title={'3'}
                                onClick={() => {
                                    setDuration(3);
                                }}
                            >
                                3
                            </DurationBtn>
                            <DurationBtn
                                duration={duration}
                                index={2}
                                className="winStyle-button"
                                data-title={'6'}
                                onClick={() => {
                                    setDuration(6);
                                }}
                            >
                                6
                            </DurationBtn>
                            <DurationBtn
                                duration={duration}
                                index={3}
                                className="winStyle-button"
                                data-title={'12'}
                                onClick={() => {
                                    setDuration(12);
                                }}
                            >
                                12
                            </DurationBtn>
                        </DurationBox>
                    </CardInfoList>
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
                </LoadingBox>
            )}
        </NFTCardBox>
    );
};

export default MenuCard;

const NFTCardBox = styled.div`
    display: inline-block;
    width: 100%;
    padding: 18px;
    border: 1px solid var(--grey);
    border-radius: 20px;
    font-weight: 500;
    min-height: 500px;
`;

const NFTImage = styled.div<{ afterLoad: boolean }>`
    width: 100%;
    border-radius: 20px;
    margin-bottom: 26px;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        border-radius: 7px;
        min-height: 280px;
    }
    &.blurAnim img {
        animation: blurAnim 0.3s linear;
    }
    @keyframe blurAnim {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
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

const LazyPlaceHolderBox = styled.div`
    width: 100%;
    min-height: 300px;
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

const DurationBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    & > div {
        padding: 10px 15px;
        border-radius: 10px;
        width: 28%;
        text-align: center;
        border: 1px solid var(--grey);
    }
`;

const DurationInfo = styled.div`
    & img {
        height: 1.2rem !important;
    }
    &::after {
        top: -40px;
        left: -40px;
        text-align: center;
        display: flex;
        align-items: center;
    }
`;

interface IDuration {
    duration: number;
    index: number;
}

const DurationBtn = styled.div<IDuration>`
    --border-gradient: conic-gradient(var(--gold), var(--gold), var(--light), var(--gold), var(--gold));
    background: ${({ duration, index }) =>
        duration == [3, 6, 12][index - 1] ? 'var(--border-gradient)' : 'var(--bg)'};
    color: ${({ duration, index }) => (duration == [3, 6, 12][index - 1] ? 'var(--gold)' : 'var(--lightgrey)')};
`;
