import styled from 'styled-components';
import { useEffect, useState } from 'react';

type Props = {
    slippagePercent: number;
    percentAry: Array<number>;
};

const SlippageInput = ({ slippagePercent, percentAry }: Props) => {
    const [warning, setWarning] = useState<boolean>();
    const [inputValue, setInputValue] = useState<number>(percentAry[slippagePercent] || 0);

    useEffect(() => {
        setInputValue(percentAry[slippagePercent] || 0);
    }, [slippagePercent, percentAry]);

    return (
        <>
            <SlippageInputBox>
                <input
                    type="number"
                    placeholder="직접입력"
                    onInput={(e) => {
                        setInputValue(+e.currentTarget.value);
                        if (+e.currentTarget.value > 50) {
                            setWarning(true);
                        } else {
                            setWarning(false);
                        }
                    }}
                    value={inputValue == 0 ? inputValue.toString().replace(/^0+/, '') : inputValue}
                    max={50}
                />
                <span>
                    <span>%</span>
                    {warning && <span>{'!'}</span>}
                </span>
            </SlippageInputBox>
            {warning && <WarningText className="fg-hotpink">슬리피지는 50%를 초과하여 설정할 수 없습니다.</WarningText>}
        </>
    );
};

export default SlippageInput;

const SlippageInputBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: var(--bg);
    & > input {
        width: 90%;
        border: 0 solid transparent;
        &:focus {
            outline: none;
        }
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
    & > span {
        height: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        & > span:first-child {
            color: var(--middlegrey);
        }
    }
    & > span > span:nth-child(2) {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: 50%;
        margin-left: 10px;
        background-color: var(--hotpink);
        width: 25px;
        height: 25px;
    }
`;

const WarningText = styled.div`
    width: 100%;
    text-align: end;
    background-color: transparent;
    font-size: 12px;
`;
