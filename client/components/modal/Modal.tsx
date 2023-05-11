import styled from 'styled-components';
import { useAppDispatch } from '@/hooks/reduxHook';
import { useAppSelector } from '@/hooks/reduxHook';
import { modalOpen, modalClose, modalType, modalAsync } from '@/module/features/modalSlice';
import { setSlippage } from '@/module/features/slippageSlice';
import { useEffect, useState } from 'react';
import ModalDescription from './ModalDescription';
import SlippagePercentList from './SlippagePercentList';
import SlippageInput from './SlippageInput';
import ModalBtn from './ModalBtn';
import ModalDurationList from './ModalDurationList';
import SlippageNotice from './SlippageNotice';
import SelectToken from './SelectToken';
import UnStake from './UnStake';
import Loading from './Loading';

const Modal = () => {
    const dispatch = useAppDispatch();
    const modal = useAppSelector((state) => state.modal);
    const [slippagePercent, setSlippagePercent] = useState<number>(1);
    const percentAry: Array<number> = [0.3, 0.5, 1, 5, 10, 20, 50];

    /** 모달창 열렸을 때 마우스 휠 이벤트 막음 */
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (modal.isOpen) {
                e.preventDefault();
            }
        };
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [modal.isOpen]);

    useEffect(() => {
        dispatch(setSlippage(percentAry[slippagePercent]));
    }, [slippagePercent]);

    const modalCloseFunction = () => {
        dispatch(modalClose());
        setSlippagePercent(1);
    };

    const SetModalDiv = () => {
        if (modal.isLoading) {
            return <Loading />;
        }

        const TitleDiv = ({ title }: { title: string }) => (
            <ModalTitle className="fg-white bg-darkgrey">{title}</ModalTitle>
        );
        const CloseBtn = () => {
            return (
                <ModalClose className="fg-grey" onClick={modalCloseFunction}>
                    {'X'}
                </ModalClose>
            );
        };

        // #region SlippageBox

        switch (modal.type) {
            case 'duration':
                return (
                    <>
                        <TitleDiv title={'Select the duration'} />
                        <ModalDescription description="the amount you grow will be locked in the jar until the term ends." />
                        <ModalDurationList />
                        <ModalBtn />
                        <CloseBtn />
                    </>
                );
            case 'slippage':
                return (
                    <>
                        <TitleDiv title={'Slippage Setting'} />
                        <ModalDescription
                            description={`Lorem ipsum dolor sit amet consectetur. Amet est feugiat et augue
                            elementum dictum ante aliquet. Lorem sem in sollicitudin cursus
                            posuere. Eget sit commodo fames nibh enim dictum.
                            Fringilla vulputate enim sit laoreet`}
                        />
                        <SlippagePercentList
                            percentAry={percentAry}
                            slippagePercent={slippagePercent}
                            setSlippagePercent={setSlippagePercent}
                        />
                        <SlippageInput slippagePercent={slippagePercent} percentAry={percentAry} />
                        <ModalBtn />
                        <CloseBtn />
                    </>
                );
            case 'selectTokenFrom':
                return (
                    <>
                        <TitleDiv title={'Select token'} />
                        <SelectToken dir={'from'} />
                        <CloseBtn />
                    </>
                );
            case 'selectTokenTo':
                return (
                    <>
                        <TitleDiv title={'Select token'} />
                        <SelectToken dir={'to'} />
                        <CloseBtn />
                    </>
                );
            case 'slippageNotice':
                return (
                    <>
                        <TitleDiv title={'슬리피지 설정 안내사항'} />
                        <SlippageNotice />
                        <CloseBtn />
                    </>
                );
            case 'unStake':
                return (
                    <>
                        <TitleDiv title={'Stake 취소 안내사항'} />
                        <UnStake />
                        <CloseBtn />
                    </>
                );
            default:
                return (
                    <>
                        <TitleDiv title={'Select the duration'} />
                        <CloseBtn />
                    </>
                );
        }
    };

    return (
        <>
            <ModalBox isOpen={modal.isOpen}>
                <ModalDiv>
                    <SetModalDiv></SetModalDiv>
                </ModalDiv>
            </ModalBox>
        </>
    );
};

export default Modal;

const ModalBox = styled.div<{ isOpen: boolean }>`
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    position: fixed;

    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9999;
`;

const ModalDiv = styled.div`
    position: relative;
    width: 537px;
    padding: 30px;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    row-gap: 24px;
    justify-content: center;
    align-items: center;
    background: var(--darkgrey);
    border: 1px solid var(--grey);
    border-radius: 5px;
`;

const ModalTestDiv = styled.div`
    width: 100%;
    z-index: 6;
    position: fixed;
    top: 10px;
    padding: 20px 0px;
    display: flex;
    justify-content: end;
    align-items: center;
    background: transparent;
    border: 1px solid #212121;
    & > div {
        padding: 10px;
        border-radius: 5px;

        justify-content: center;
        align-items: center;
        background: var(--grey);
        border: 1px solid #212121;
        &:hover {
            background: var(--blue);
            cursor: pointer;
        }
    }
`;

const ModalTitle = styled.div`
    width: 100%;
    font-size: 19px;
    line-height: 28px;
    text-align: left;
`;

const ModalClose = styled.div`
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 1.5rem;
    border: none;
    background-color: transparent;
    cursor: pointer;
    &:hover {
        filter: drop-shadow(0 0 1px var(--gold));
    }
`;
