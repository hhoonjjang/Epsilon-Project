import { createSlice } from '@reduxjs/toolkit';

interface SwapTokenSelectedState {
    from: string;
    to: string;
    amount: number;
}

const initialState: SwapTokenSelectedState = {
    from: 'notChoose',
    to: 'notChoose',
    amount: 0,
};

const swapTokenSelectedSlice = createSlice({
    name: 'swapTokenSelected',
    initialState,
    reducers: {
        tokenSwapFrom: (state, { payload: name }) => {
            state.from = name;
        },
        tokenSwapTo: (state, { payload: name }) => {
            state.to = name;
        },
        setAmount: (state, { payload }) => {
            state.amount = +payload;
        },
    },
});

const { actions, reducer: swapTokenReducer } = swapTokenSelectedSlice;

export const { tokenSwapFrom, tokenSwapTo, setAmount } = actions;

export default swapTokenReducer;
