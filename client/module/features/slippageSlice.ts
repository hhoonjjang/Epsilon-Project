import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface SlippageState {
    value: number;
}

const initialState: SlippageState = {
    value: 0.5,
};

const slippageSlice = createSlice({
    name: 'slippage',
    initialState,
    reducers: {
        setSlippage: (state, { payload }) => {
            state.value = +payload;
        },
    },
});

const { actions, reducer: slippageReducer } = slippageSlice;
export const { setSlippage } = actions;
export default slippageReducer;
