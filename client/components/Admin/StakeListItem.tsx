import axios from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { modalAsync } from '@/module/features/modalSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import dayjs from 'dayjs';

interface IStakingItem {
    id: number;
    name: string;
    tokenId: number;
    average: number;
    price: number;
    amount: Array<number>;
    kind: string;
    createdAt: Date;
    realAmount: any;
    setIsListUpdate: Dispatch<SetStateAction<boolean>>;
}

const StakeListItem = ({ ...data }: IStakingItem) => {
    const [inputAmount, setInputAmount] = useState<number>(0);
    const dispatch = useAppDispatch();
    const modal = useAppSelector((state) => state.modal);

    const updateStakePriceFunc = async () => {
        if (!inputAmount) return;
        try {
            const updateStakePrice = await axios.post('http://13.125.251.97:8080/api/admin/updateStakePrice', {
                id: data.id,
                price: inputAmount,
            });
            console.log(updateStakePrice);
            data.setIsListUpdate((state) => !state);
            return updateStakePrice;
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    return (
        <ListBox>
            <Header>
                <Name>{data.name || 'name'}</Name>
                <TokenId>tokenId : {data.tokenId || 'id'}</TokenId>
            </Header>
            <Details>
                <Average>average: {data.average}</Average>
                <Price>price : {data.price}</Price>
                <Amount>amount : {data.realAmount || data.amount?.filter((item) => item !== 0).pop() || 0}</Amount>
                <InputWrapper>
                    <StyledInput
                        type="number"
                        onInput={(e) => {
                            setInputAmount(e.currentTarget.valueAsNumber);
                        }}
                    />
                    <ChangeBtn
                        onClick={() => {
                            dispatch(modalAsync({ ...modal, promiseFunc: updateStakePriceFunc() }));
                        }}
                    >
                        Update
                    </ChangeBtn>
                </InputWrapper>
            </Details>
            <DateBox>
                <div>kind : {data.kind}</div> <div> 시작 : {dayjs(data.createdAt).format('YYYY/MM/DD HH:mm')}</div>
            </DateBox>
        </ListBox>
    );
};

export default StakeListItem;

const ListBox = styled.div`
    width: 100%;
    background-color: var(--darkgrey);
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }

    &.close {
        opacity: 0.3;
        pointer-events: none;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    white-space: nowrap;
    padding-bottom: 0.5rem;
    font-size: 1.2rem;
    border-bottom: 1px solid var(--middlegrey);
`;

const Name = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--white);
`;

const TokenId = styled.div`
    font-size: 1.2rem;
    color: var(--lightgrey);
`;

const Details = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.5rem;
`;

const Average = styled.div`
    font-size: 1.2rem;
    color: var(--lightgrey);
`;

const Price = styled.div`
    font-size: 1.2rem;
    color: var(--lightgrey);
`;

const Amount = styled.div`
    font-size: 1.2rem;
    color: var(--lightgrey);
`;

const InputWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const StyledInput = styled.input`
    font-size: 1rem;
    color: var(--lightgrey);
    background-color: var(--dark);
    border: none;
    padding: 0.5rem;
    border-radius: 5px;

    &:focus {
        outline: none;
        box-shadow: 0px 0px 2px var(--blue);
    }
`;

const ChangeBtn = styled.div`
    background-color: var(--orange);
    color: var(--white);
    font-size: 1rem;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: var(--purple);
    }
`;

const DateBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    text-align: right;
    & > div {
        padding: 10px;
    }
`;
