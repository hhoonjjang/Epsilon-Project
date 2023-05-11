import { HYDRATE } from 'next-redux-wrapper';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ModalState {
    isOpen: boolean;
    isLoading: boolean;
    type: string;
    request: boolean;
}

/**
 * type : duration, slippage, selectToken, slippageNotice
 */
const initialState: ModalState = {
    isOpen: false,
    isLoading: false,
    type: 'duration',
    request: false,
};

export const modalAsync = createAsyncThunk(
    'modal/modalAsync',
    async ({
        isOpen,
        isLoading,
        type,
        promiseFunc,
    }: {
        isOpen: boolean;
        isLoading: boolean;
        type: string;
        promiseFunc: Promise<any>;
    }) => {
        await new Promise((resolve, reject) => {
            promiseFunc
                .then((data) => {
                    data == 'success'
                        ? alert('해당 요청이 성공적으로 완료 되었습니다.')
                        : alert('해당 요청이 네트워크 상황에 의하여 실패하였습니다.');
                    resolve(data);
                })
                .catch((err) => {
                    console.log(err, '나는 에러냐?');
                    reject(err);
                });
        });
        return { isOpen, type, isLoading };
    }
);

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        modalOpen: (state) => {
            state.isOpen = true;
        },
        modalClose: (state) => {
            state.isOpen = false;
        },
        modalType: (state, { payload: stateType }) => {
            return { ...state, isOpen: true, type: stateType };
        },
        modalRequest: (state, { payload }) => {
            return { ...state, request: payload };
        },
    },

    extraReducers: {
        [modalAsync.pending.type]: (state) => {
            console.log('pending');
            state.isOpen = true;
            state.isLoading = true;
        },
        [modalAsync.fulfilled.type]: (state, action) => {
            console.log('fulfilled', action.payload);
            return { ...state, isLoading: false, isOpen: false, request: false };
        },
        [modalAsync.rejected.type]: (state, action) => {
            console.log('reject');
            return { ...state, isLoading: false, isOpen: false, request: false };
        },
    },
});

const { actions, reducer: modalReducer } = modalSlice;
export const { modalOpen, modalClose, modalType, modalRequest } = actions;
export default modalReducer;
