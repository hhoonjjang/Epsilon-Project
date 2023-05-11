import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';

const BatchDurationBox = ({
    setStakeDuration,
    checking,
    checkedTokens,
    tokenId,
    durationData,
}: {
    setStakeDuration: Dispatch<SetStateAction<number[]>>;
    checking: boolean;
    checkedTokens: number[];
    tokenId: number;
    durationData: number[];
}) => {
    const [stakeDurationIndex, setStakeDurationIndex] = useState<number>(0);

    const tokenIdx = checkedTokens.findIndex((inner) => inner == tokenId);

    useEffect(() => {
        if (checking) {
            setStakeDurationIndex(1);
        } else {
            setStakeDurationIndex(0);
        }
    }, [checking]);
    return (
        <>
            <div
                onClick={() => {
                    if (checking) {
                        setStakeDurationIndex(1);
                        setStakeDuration(
                            (state) =>
                                (state = [...state.slice(0, tokenIdx), durationData[0], ...state.slice(tokenIdx + 1)])
                        );
                    }
                }}
                className={checking ? (stakeDurationIndex == 1 ? 'hoverOn on' : 'hoverOn') : ''}
            >
                {durationData[0]}
            </div>
            <div
                onClick={() => {
                    if (checking) {
                        setStakeDurationIndex(2);
                        setStakeDuration(
                            (state) =>
                                (state = [...state.slice(0, tokenIdx), durationData[1], ...state.slice(tokenIdx + 1)])
                        );
                    }
                }}
                className={checking ? (stakeDurationIndex == 2 ? 'hoverOn on' : 'hoverOn') : ''}
            >
                {durationData[1]}
            </div>
            <div
                onClick={() => {
                    if (checking) {
                        setStakeDurationIndex(3);
                        setStakeDuration(
                            (state) =>
                                (state = [...state.slice(0, tokenIdx), durationData[2], ...state.slice(tokenIdx + 1)])
                        );
                    }
                }}
                className={checking ? (stakeDurationIndex == 3 ? 'hoverOn on' : 'hoverOn') : ''}
            >
                {durationData[2]}
            </div>
        </>
    );
};

export default BatchDurationBox;
