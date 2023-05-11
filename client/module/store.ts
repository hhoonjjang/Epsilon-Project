import { combineReducers, configureStore, PayloadAction, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import counterReducer from './features/counterSlice';
import modalReducer from './features/modalSlice';
import swapTokenReducer from './features/swapTokenSelectedSlice';
import slippageReducer from './features/slippageSlice';
import stakeReducer from './features/stakeSlice';
import rewardReducer from './features/rewardSlice';
import balanceSliceReducer from './features/balanceSlice';
import durationAndChargeSliceReducer from './features/durationAndCharge';
import logger from 'redux-logger';

const reducer = (state: any, action: PayloadAction<any>) => {
    return combineReducers({
        counter: counterReducer,
        modal: modalReducer,
        swapToken: swapTokenReducer,
        slippage: slippageReducer,
        stake: stakeReducer,
        reward: rewardReducer,
        balance: balanceSliceReducer,
        durationAndCharge: durationAndChargeSliceReducer,
    })(state, action);
};

const makeStore = () => {
    return configureStore({
        reducer,
        // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    });
};

const store = makeStore();

export const wrapper = createWrapper<AppStore>(makeStore, {
    debug: process.env.NODE_ENV === 'development',
});
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;
