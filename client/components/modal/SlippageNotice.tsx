import { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch } from '@/hooks/reduxHook';
import { modalClose, modalType } from '@/module/features/modalSlice';

const SlippageNotice = () => {
    const [checkedList, setCheckedList] = useState<Array<boolean>>([false, false, false]);
    const textAry = [
        '슬리피지 최종 설정 전 선택한 슬리피지에 따른 예상 거래 수량과 최소 거래 수량을 확인하시길 바랍니다.',
        '과도한 슬리피지 설정은 거래 허용 범위를 넓혀 손실이 발생할 수 있으니 각별히 주의해주시길 바랍니다.',
        "스왑 거래와 풀 예치에 능숙한 이용자만 '슬리피지 설정'을 사용하시길 바랍니다.",
    ];

    const dispatch = useAppDispatch();

    const modalNextFunction = () => {
        if (!checkedList.filter((item) => !item).length) dispatch(modalType('slippage'));
    };
    return (
        <SlippageNoticeBox>
            {textAry.map((item, index) => {
                return (
                    <li key={`${item}-${index}`} className={checkedList[index] ? 'checked' : ''}>
                        <div
                            onClick={() =>
                                setCheckedList((state) => {
                                    const tempAry = [...state];
                                    tempAry[index] = !tempAry[index];
                                    return tempAry;
                                })
                            }
                        >
                            <img src="/img/Vector.svg" alt="vector" />
                        </div>
                        <div>{item}</div>
                    </li>
                );
            })}

            <NoticeAcceptBtn onClick={modalNextFunction}>확인했습니다.</NoticeAcceptBtn>
        </SlippageNoticeBox>
    );
};

export default SlippageNotice;

const SlippageNoticeBox = styled.div`
    padding-top: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 19px;
    img {
        background-color: transparent;
        &:hover {
            filter: drop-shadow(0 0 2px var(--orange));
        }
    }
    & > li {
        font-size: 12px;
        line-height: 17.38px;
        background-color: transparent;
        display: flex;
        list-style: none;
        column-gap: 16px;
        & > div {
            display: flex;
        }
        &:not(.checked) img {
            filter: grayscale(100%);
            &:hover {
                filter: grayscale(100%) drop-shadow(0 0 2px var(--orange));
            }
        }
    }
`;

const NoticeAcceptBtn = styled.div`
    width: 113%;
    padding: 20px 0;
    margin-top: 80px;
    text-align: center;
    border: 1px solid var(--grey);
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    font-size: 15px;
    font-weight: 600;
    transform: translateX(-5.8%);
    &:hover {
        color: var(--bg);
        background: linear-gradient(90deg, #ffd740 0%, #ffab00 100%);
        cursor: pointer;
    }
`;
