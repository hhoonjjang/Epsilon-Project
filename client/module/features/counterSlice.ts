import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface CounterState {
    value: number;
}

const initialState: CounterState = {
    value: 0,
};

export const counterAsync = createAsyncThunk('counter/counterAsync', async (value: number) => {
    const curPromise = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('done');
        }, 1000);
    });
    return value;
});

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
    },

    extraReducers: {
        [counterAsync.pending.type]: (state) => {
            console.log('pending');
        },
        [counterAsync.fulfilled.type]: (state, action) => {
            console.log('fulfilled', action.payload);
            state.value = action.payload;
        },
        [counterAsync.rejected.type]: (state, action) => {
            console.log('reject');
        },
    },
});

const { actions, reducer: counterReducer } = counterSlice;
export const { increment, decrement } = actions;
export default counterReducer;
