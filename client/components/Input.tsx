import { useState, Dispatch, SetStateAction } from 'react';

const Input = ({
    props,
    state,
    setState,
}: {
    props: string;
    state: string;
    setState: Dispatch<SetStateAction<string>>;
}) => {
    return (
        <div style={{ display: 'flex', columnGap: '10px' }}>
            <div>{props} : </div>
            <div>
                <input onChange={(e) => setState(e.target.value)} value={state} />
            </div>
        </div>
    );
};

export default Input;
