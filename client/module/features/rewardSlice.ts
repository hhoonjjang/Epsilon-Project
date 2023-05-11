import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface IRewardSlice {
    on: boolean;
}

const initialState: IRewardSlice = {
    on: false,
};

const rewardSlice = createSlice({
    name: 'reward',
    initialState,
    reducers: {
        setRewardOn: (state, { payload }) => {
            state.on = payload;
        },
    },
});

const { actions, reducer: rewardReducer } = rewardSlice;

export const { setRewardOn } = actions;

export default rewardReducer;
