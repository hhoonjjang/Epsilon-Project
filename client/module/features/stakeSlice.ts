import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface IStakeSlice {
    tokenId: number;
    duration: number;
    charge: number;
    amount: number;
    price: number;
}

const initialState: IStakeSlice = {
    tokenId: 0,
    amount: 0,
    charge: 0,
    duration: 0,
    price: 0,
};

const stakeSlice = createSlice({
    name: 'stake',
    initialState,
    reducers: {
        setDuration: (state, { payload }) => {
            state.duration = payload;
        },
        setTokenId: (state, { payload }) => {
            state.tokenId = payload;
        },
        setAmount: (state, { payload }) => {
            state.amount = payload;
        },
        setPrice: (state, { payload }) => {
            state.price = payload;
        },
        setCharge: (state, { payload }) => {
            state.charge = payload;
        },
        reset: (state, action) => {
            return { ...initialState };
        },
    },
});

const { actions, reducer: stakeReducer } = stakeSlice;

export const { setDuration, setTokenId, setAmount, setPrice, reset, setCharge } = actions;

export default stakeReducer;
