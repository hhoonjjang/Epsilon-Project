import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
interface tokenBalance {
    duration: number;
    charge: number;
}
const initialState: Array<tokenBalance> = [
    {
        duration: 3,
        charge: 3,
    },
    {
        duration: 6,
        charge: 6,
    },
    {
        duration: 12,
        charge: 12,
    },
];

const durationAndChargeSlice = createSlice({
    name: 'durationAndCharge',
    initialState,
    reducers: {
        setDurationAndChargeArray: (state, { payload }) => {
            return [...payload];
        },
    },
});

const { actions, reducer: durationAndChargeSliceReducer } = durationAndChargeSlice;

export const { setDurationAndChargeArray } = actions;

export default durationAndChargeSliceReducer;
