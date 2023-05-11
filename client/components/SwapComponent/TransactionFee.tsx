import styled from 'styled-components';
import { useWeb3 } from '@/hooks/useWeb3';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ITransactionList from '@/interface/ITransactionList.inerface';
import { makeReducedString } from '@/module/tools';
import HoverFunction from '@/module/HoverFunction';
import { makeDateString } from '@/module/tools';

const TransactionFee = () => {
    const longString: string = '0xD8435165156fd156asdfdasfasdfasfasdf55F2';
    const shortString: string = longString.slice(0, 8) + '...' + longString.slice(-4);
    // 긴 문자열을 짧게 생략해주는 방식을 써주었음 링크로 만약에 개인 지갑에 가는 것이 있다면 이 긴 스트링을
    // url로 사용해도 무방 할 것 같다.
    const [txList, setTxList] = useState<Array<ITransactionList>>([]);
    const web3 = useWeb3();

    const metaLogin = () => {
        web3.logIn();
    };

    useEffect(() => {
        metaLogin();
    }, []);

    useEffect(() => {
        if (web3.account) {
            try {
                (async () => {
                    const { data } = await axios.get('http://13.125.251.97:8080/api/swap/transactionList', {
                        params: {
                            account: web3.account,
                        },
                    });
                    setTxList(data);
                    return data;
                })();
            } catch (error) {
                console.error(error);
            }
        }
    }, [web3.account]);

    return (
        <TransactionFeeDiv>
            <div>트랜잭션 내역</div>
            <TableHeaderDiv>
                <div>유형</div>
                <div>해시</div>
                <div>상태</div>
                <div>일자</div>
            </TableHeaderDiv>
            {txList.map((item, index) => {
                return (
                    <TableDiv key={`${item}-${index}`}>
                        <div>{item.type}</div>
                        <div>
                            <HoverFunction innerText={makeReducedString(item.hash)} text={item.hash}></HoverFunction>
                        </div>
                        <div>{item.status}</div>
                        <div>{makeDateString(item.createdAt)}</div>
                    </TableDiv>
                );
            })}
        </TransactionFeeDiv>
    );
};

export default TransactionFee;

const TransactionFeeDiv = styled.div`
    width: 50%;
    margin: auto;
    height: 1000px;
    overflow-y: scroll;
    & > div {
        margin: 1rem 0;
        color: #9e9e9e;
        font-weight: 700;
    }
    & > div:first-child {
        position: sticky;
    }
`;

const TableHeaderDiv = styled.div`
    display: flex;
    padding: 10px 0;
    border-top: 1px solid #333333;
    border-bottom: 1px solid #333333;
    font-size: 13px;
    font-weight: 500;

    & > div:first-child {
        width: 20%;
        color: #9e9e9e;
    }
    & > div:nth-child(2) {
        width: 30%;
        color: #9e9e9e;
    }
    & > div:nth-child(3) {
        width: 20%;
        color: #9e9e9e;
    }
    & > div:nth-child(4) {
        width: 30%;
        color: #9e9e9e;

        text-align: right;
    }
`;

const TableDiv = styled.div`
    display: flex;
    font-size: 13px;

    & > div:first-child {
        width: 20%;
        color: #bdbdbd;
    }
    & > div:nth-child(2) {
        width: 30%;
        color: var(--blue);
    }
    & > div:nth-child(3) {
        width: 20%;
        color: #bdbdbd;
    }
    & > div:nth-child(4) {
        width: 30%;
        text-align: right;
        color: #bdbdbd;
    }
`;
