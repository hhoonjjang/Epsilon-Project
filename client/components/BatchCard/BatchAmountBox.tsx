import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import IBatchContents from '@/interface/IBatch.interface';

const BatchAmountBox = ({
    item,
    checking,
    setStakeAmount,
    checkedTokens,
}: {
    item: IBatchContents;
    checking: boolean;
    setStakeAmount: Dispatch<SetStateAction<number[]>>;
    checkedTokens: number[];
}) => {
    const [amountNum, setAmountNum] = useState<number | string>('');
    const tokenIdx = checkedTokens.findIndex((inner) => inner == item.tokenId);
    useEffect(() => {
        if (!checking) {
            console.log('끼얏호우');
            setAmountNum('');
        }
    }, [checking]);

    const maxValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxValue = item.amount;
        let inputValue = parseFloat(e.target.value);

        if (inputValue > maxValue) {
            inputValue = maxValue;
        }
        setAmountNum(inputValue);
    };

    return (
        <>
            <label htmlFor={item.tokenId.toString()}>Stake Amount : </label>
            <input
                id={item.tokenId.toString()}
                placeholder={item.amount.toString()}
                type="number"
                max="999"
                onBlur={(e) => {
                    setStakeAmount(
                        (state) =>
                            (state = [...state.slice(0, tokenIdx), +e.target.value, ...state.slice(tokenIdx + 1)])
                    );
                }}
                onChange={(e) => {
                    console.log(e.target.value);
                    maxValue(e);
                }}
                value={amountNum}
                disabled={!checking}
            />
        </>
    );
};

export default BatchAmountBox;
