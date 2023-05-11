import { useEffect } from 'react';
import styled from 'styled-components';
import { Dispatch, SetStateAction } from 'react';
import { useAppSelector } from '@/hooks/reduxHook';

type Props = {
    percentAry: Array<number>;
    slippagePercent: number;
    setSlippagePercent: Dispatch<SetStateAction<number>>;
};

const SlippagePercentList = ({ percentAry, slippagePercent, setSlippagePercent }: Props) => {
    const modal = useAppSelector((state) => state.modal);

    useEffect(() => {
        if (!modal.isOpen) {
            setSlippagePercent(1);
        }
    }, [modal]);
    return (
        <SlippagePercentBox>
            {percentAry.map((item, index) => {
                return (
                    <li
                        onClick={() => {
                            setSlippagePercent(index);
                        }}
                        className={slippagePercent == index ? 'selectedPercent' : ''}
                        key={`percentAry-${index}`}
                    >
                        {item}%
                    </li>
                );
            })}
        </SlippagePercentBox>
    );
};

export default SlippagePercentList;

const SlippagePercentBox = styled.ul`
    list-style: none;
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-top: 20px;
    & > li {
        width: 12%;
        padding: 5px 0;
        text-align: center;
        border: 1px solid var(--dark);
        border-radius: 5px;
        font-size: 13px;
        line-height: 19px;
        position: relative;
    }
    & > li.selectedPercent {
        background-color: var(--fg);
        color: var(--bg);
    }
    & > li:nth-child(2) {
        &::after {
            content: '기본값';
            position: absolute;
            width: calc(100% - 4px);
            top: -30px;
            font-size: 10px;
            background: linear-gradient(270deg, #ffd740 0%, #ffab00 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            left: 0;
            padding: 2px;
            text-align: center;
            border: 1px solid var(--gold);
            border-radius: 15px;
        }
    }
`;
