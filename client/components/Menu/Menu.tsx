import styled from 'styled-components';
import { useObserver } from '@/hooks/useObserver';
import { useRef, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import MenuCard from './MenuCard';
import SideBar from './SideBar';

const OFFSET = 6;
const getNftList = async ({ pageParam = 0 }) => {
    try {
        // const { data } = await axios.get('http://13.125.251.97:8080/api/nft/nftlist', {
        const { data } = await axios.get('http://13.125.251.97:8080/api/nft/mainList', {
            params: {
                limit: OFFSET,
                offset: pageParam,
            },
        });
        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
};

const Menu = () => {
    const bottom = useRef(null);
    const [isInfinite, setIsInfinite] = useState<boolean>(false);

    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useInfiniteQuery(
        'nftList',
        getNftList,
        {
            getNextPageParam: (lastPage) => {
                if (!lastPage) return false;
                const { next } = lastPage;
                if (!next) {
                    return false;
                }
                return Number(next.offset);
            },
        }
    );
    const onIntersect = ([entry]: IntersectionObserverEntry[]) => entry.isIntersecting && fetchNextPage();

    useObserver({
        target: bottom,
        onIntersect,
    });

    return (
        <MenuBox>
            <SideBar />
            <MainBox>
                <ListBox>
                    {status === 'loading' && (
                        <div>
                            <MenuCard name={''} img="" price={0} tokenId={-1} staked={-1} amount={-1}></MenuCard>
                            <MenuCard name={''} img="" price={0} tokenId={-1} staked={-1} amount={-1}></MenuCard>
                            <MenuCard name={''} img="" price={0} tokenId={-1} staked={-1} amount={-1}></MenuCard>
                            <MenuCard name={''} img="" price={0} tokenId={-1} staked={-1} amount={-1}></MenuCard>
                            <MenuCard name={''} img="" price={0} tokenId={-1} staked={-1} amount={-1}></MenuCard>
                            <MenuCard name={''} img="" price={0} tokenId={-1} staked={-1} amount={-1}></MenuCard>
                        </div>
                    )}
                    {status == 'success' &&
                        data?.pages.map((group: any, index: number) => {
                            return (
                                <div key={`my-${index}`}>
                                    {group?.result?.map((item: any, index: number) => {
                                        return (
                                            <div key={`MenuCard-${index}`}>
                                                <MenuCard
                                                    name={item.nft?.name || 'name'}
                                                    img={item.nft?.img || 'img'}
                                                    tokenId={item.nft?.tokenId}
                                                    price={
                                                        item.price ||
                                                        (Array.isArray(item.amount) &&
                                                            item.amount
                                                                .filter((filtered: number) => filtered != 0)
                                                                .reduce((sum: number, currValue: number) => {
                                                                    const curLen = item.amount.filter(
                                                                        (filtered: number) => filtered != 0
                                                                    ).length;
                                                                    return (sum + currValue) / curLen;
                                                                }, 0)) ||
                                                        item.average
                                                    }
                                                    staked={item.staked}
                                                    amount={item.nft?.amount}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                </ListBox>
                <BtnBox>
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
                </BtnBox>
            </MainBox>
            {/* {isFetchingNextPage && <p>계속 불러오는 중</p>} */}
            {hasNextPage && isInfinite && <div ref={bottom} />}
        </MenuBox>
    );
};

export default Menu;

const MenuBox = styled.div`
    width: 100%;
    display: flex;
    padding: 0 10% 50px 10%;
    position: relative;
`;

const MainBox = styled.div`
    width: 75%;
    height: 100%;
`;

const ListBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    & > div {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        column-gap: 2%;
        row-gap: 20px;
    }
    & > div > div {
        width: 32%;
    }
`;

const BtnBox = styled.div`
    margin-top: 50px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    align-items: center;
`;
const MoreBtn = styled.div<{ isInfinite: boolean }>`
    z-index: 10;
    width: 40% !important;
    height: 120px;
    border: 1px solid var(--grey);
    font-size: 1.5rem !important;
`;
