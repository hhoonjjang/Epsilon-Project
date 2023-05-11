import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { modalClose, modalRequest } from '@/module/features/modalSlice';
import { setAmount, tokenSwapFrom, tokenSwapTo } from '@/module/features/swapTokenSelectedSlice';

const ModalBtn = () => {
    const dispatch = useAppDispatch();
    const modal = useAppSelector((state) => state.modal);

    const modalCloseFunction = () => {
        dispatch(modalClose());
    };

    const modalConfirmFunction = () => {
        dispatch(modalRequest(true));
    };

    return (
        <ModalBtnBox>
            <div onClick={modalCloseFunction}>취소</div>
            <div
                onClick={() => {
                    modalConfirmFunction();
                }}
            >
                확인
            </div>
        </ModalBtnBox>
    );
};

export default ModalBtn;

const ModalBtnBox = styled.div`
    width: 113%;
    display: flex;
    justify-content: space-between;
    & > div {
        width: 50%;
        padding: 20px 0;
        text-align: center;
        border: 1px solid var(--grey);
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        &:hover {
            color: var(--bg);
            background: linear-gradient(90deg, #ffd740 0%, #ffab00 100%);
            cursor: pointer;
        }
    }
`;
