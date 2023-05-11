import styled from 'styled-components';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getDateDifference, makeReducedString } from '../../module/tools';
import HoverFunction from '@/module/HoverFunction';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { modalAsync } from '@/module/features/modalSlice';
import ITransactionList from '@/interface/ITransactionList.inerface';
import { makeDateString } from '../../module/tools';
import StakeListItem from '@/components/Admin/StakeListItem';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const excelFileExtension = '.xlsx';

interface IStakingItem {
    name: string;
    tokenId: number;
    average: number;
    price: number;
    amount: Array<number>;
    id: number;
    createdAt: Date;
    kind: string;
    nftId: any;
}

interface IStakeDuration {
    duration: number;
    charge: number;
}

const Admin = ({ web3, account }: { web3: any; account: string }) => {
    const [makeInput, setMakeInput] = useState<number>();
    const [makeStakeInput, setMakeStakeInput] = useState<number>();
    const [makeICOInput, setMakeICOInput] = useState<number>();
    const [burnInput, setBurnInput] = useState<number>();
    const [withdrawHUTInput, setWithdrawHUTInput] = useState<number>();
    const [withdrawMATICInput, setWithdrawMATICInput] = useState<number>();
    const [feeRateInput, setFeeRateInput] = useState<number>();
    const [adminTxList, setAdminTxList] = useState<Array<ITransactionList>>([]);
    const [userTxList, setUserTxList] = useState<Array<ITransactionList>>([]);
    const [pageType, setPageType] = useState<string>('currency');
    const [stakingList, setStakingList] = useState<Array<IStakingItem>>([]);
    const [isListUpdate, setIsListUpdate] = useState<boolean>(false);
    const [userFilterText, setUserFilterText] = useState<string>('');
    const [stakeFilterText, setStakeFilterText] = useState<string>('');
    const [stakeFilterTime, setStakeFilterTime] = useState<string>('기간별');
    const [stakeDurationList, setStakeDurationList] = useState<Array<IStakeDuration>>([
        { duration: 3, charge: 3 },
        { duration: 6, charge: 6 },
        { duration: 12, charge: 12 },
    ]);
    const [totalStake, setTotalStake] = useState<number>(0);
    const [totalRewards, setTotalRewards] = useState<number>(0);
    const [stakeVendorHut, setStakeVendorHut] = useState<number>(0);
    const [swapVendorHut, setSwapVendorHut] = useState<Array<number>>([0, 0]);
    const [totalSwapSupplyHut, setTotalSwapSupplyHut] = useState<number>(0);
    const [icoVendorHut, setICOVendorHut] = useState<number>(0);
    const [icoTarget, setICOTarget] = useState<number>(0);
    const [icoAmount, setICOAmount] = useState<number>(0);
    const [icoInvestor, setICOInvestor] = useState<number>(0);

    const excelFileName = `${makeDateString(Date.now().toString())}_${account}`;
    const modal = useAppSelector((state) => state.modal);
    const durationAndCharge = useAppSelector((state) => state.durationAndCharge);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!account) {
            web3.logIn();
        }
    }, []);

    useEffect(() => {
        getStakingList();
    }, [isListUpdate]);

    useEffect(() => {
        getAdminTxFunc();
        if (!modal.isOpen) {
            getUserTxFunc();
            getTotalStakedData();
            getSwapHutAmount();
            getICOHutAmount();
        }
    }, [modal.isOpen]);

    useEffect(() => {
        setStakeDurationList(durationAndCharge);
    }, [durationAndCharge]);

    const makeHUT = async (): Promise<any> => {
        const { data } = await axios.post('http://13.125.251.97:8080/api/contract/mintVendor', {
            amount: makeInput,
            account: web3.account,
        });
        console.log('data', data);
        if (web3.web3) {
            const makeHUT = await web3?.web3.eth.sendTransaction(data);

            console.log('makeHUT', makeHUT);
            const txData = {
                amount: makeInput,
                type: 'Token',
                status: 'Success',
                from: makeHUT.from,
                to: makeHUT.to,
                hash: makeHUT.transactionHash,
                saveType: 'mint',
            };
            try {
                const { data } = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', { ...txData });
                return data;
            } catch (error) {
                console.error(error);
                return error;
            }
        }
    };

    const makeStakeHUT = async (): Promise<any> => {
        const { data } = await axios.post('http://13.125.251.97:8080/api/contract/mintStaking', {
            amount: makeStakeInput,
            account: web3.account,
        });
        console.log('data', data);
        if (web3.web3) {
            const makeHUT = await web3?.web3.eth.sendTransaction(data);

            console.log('makeHUT', makeHUT);
            const txData = {
                amount: makeStakeInput,
                type: 'Token',
                status: 'Success',
                from: makeHUT.from,
                to: makeHUT.to,
                hash: makeHUT.transactionHash,
                saveType: 'mint',
            };
            try {
                const { data } = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', { ...txData });
                return data;
            } catch (error) {
                console.error(error);
                return error;
            }
        }
    };

    const makeICOHUT = async (): Promise<any> => {
        const { data } = await axios.post('http://13.125.251.97:8080/api/contract/mintICO', {
            amount: makeICOInput,
            account: web3.account,
        });
        console.log('data', data);
        if (web3.web3) {
            const makeHUT = await web3?.web3.eth.sendTransaction(data);

            console.log('makeHUT', makeHUT);
            const txData = {
                amount: makeICOInput,
                type: 'Token',
                status: 'Success',
                from: makeHUT.from,
                to: makeHUT.to,
                hash: makeHUT.transactionHash,
                saveType: 'mint',
            };
            try {
                const { data } = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', { ...txData });
                return data;
            } catch (error) {
                console.error(error);
                return error;
            }
        }
    };
    // _id, amount, type status, createdeAt, from , to, hash
    const burnHUT = async (): Promise<any> => {
        console.log(burnInput);
        const { data } = await axios.post('http://13.125.251.97:8080/api/contract/burn', {
            amount: burnInput,
            account: web3.account,
        });
        if (web3.web3) {
            try {
                const burnHUT = await web3?.web3.eth.sendTransaction(data);
                console.log('burnHUT', burnHUT);

                const txData = {
                    amount: Number(makeInput),
                    type: 'Token',
                    status: 'Success',
                    from: burnHUT.from,
                    to: burnHUT.to,
                    hash: burnHUT.transactionHash,
                    saveType: 'burn',
                };
                const { data: saveData } = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', {
                    ...txData,
                });
                return saveData;
            } catch (error) {
                console.error(error);
                return error;
            }
        }
    };

    const withdrawHUT = async () => {
        console.log(withdrawHUTInput);
        const { data } = await axios.post('http://13.125.251.97:8080/api/contract/withdrawHutToken', {
            amount: withdrawHUTInput,
            account,
        });
        if (web3.web3) {
            try {
                const withdrawHUT = await web3?.web3.eth.sendTransaction(data);
                console.log(withdrawHUT);
                const txData = {
                    amount: Number(makeInput),
                    type: 'Token',
                    status: 'Success',
                    from: withdrawHUT.from,
                    to: withdrawHUT.to,
                    hash: withdrawHUT.transactionHash,
                    saveType: 'withdraw',
                };
                const { data: saveData } = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', {
                    ...txData,
                });
                return saveData;
            } catch (error) {
                console.error(error);
                return error;
            }
        }
    };

    const withdrawMatic = async () => {
        console.log(withdrawMATICInput);
        const { data } = await axios.post('http://13.125.251.97:8080/api/contract/withdrawMatic', {
            amount: withdrawMATICInput,
            account,
        });
        if (web3.web3) {
            try {
                const withdrawMatic = await web3?.web3.eth.sendTransaction(data);
                console.log(withdrawMatic);
                const txData = {
                    amount: Number(makeInput),
                    type: 'Token',
                    status: 'Success',
                    from: withdrawMatic.from,
                    to: withdrawMatic.to,
                    hash: withdrawMatic.transactionHash,
                    saveType: 'withdraw',
                };
                const { data: saveData } = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', {
                    ...txData,
                });
                return saveData;
            } catch (error) {
                console.error(error);
                return error;
            }
        }
    };

    const getAdminTxFunc = async () => {
        try {
            const { data } = await axios.get('http://13.125.251.97:8080/api/admin/transactionList');
            setAdminTxList([...data]);
            return data;
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    const getUserTxFunc = async () => {
        try {
            const { data } = await axios.get('http://13.125.251.97:8080/api/admin/userTransactionList');
            setUserTxList([...data]);
            return data;
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    const getStakingList = async () => {
        try {
            const { data } = await axios.get('http://13.125.251.97:8080/api/admin/stakingList');
            data?.map((item: any, index: number) => {
                setStakingList((state) => {
                    const temp = state;
                    temp[index] = {
                        name: item.nftId?.name,
                        tokenId: item.nftId?.tokenId,
                        kind: item.nftId?.kind,
                        average: item.average,
                        price: item.price,
                        id: item._id,
                        amount: item.amount,
                        createdAt: new Date(item.createdAt),
                        nftId: item.nftId,
                    };
                    return [...temp];
                });
            });
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const updateDBDurationAndCharge = async () => {
        // 여기
        const { data } = await axios.post('http://13.125.251.97:8080/api/admin/updateDurationAndCharge', {
            stakeDurationList,
        });
        return data;
    };

    const downloadExcelFile = (excelData: any) => {
        const ws = XLSX.utils.aoa_to_sheet([
            [`작성자_${account}`],
            [],
            ['이름', '가격', '갯수', 'TokenId', '스테이크 시작 시간', '종류', 'DB Id'],
        ]);

        excelData.map((data: any) => {
            if (!data) return;
            XLSX.utils.sheet_add_aoa(
                ws,
                [[data.name, data.price, data.amount, data.tokenId, data.stakeStart, data.kind, data.dbId]],
                { origin: -1 }
            );
            ws['!cols'] = [{ wpx: 200 }, { wpx: 200 }];
            return false;
        });
        const wb: any = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelButter = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const excelFile = new Blob([excelButter], { type: excelFileType });
        FileSaver.saveAs(excelFile, excelFileName + excelFileExtension);
    };

    const getTotalStakedData = async () => {
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/adminSteakDisplay');
            setTotalStake(data.totalSteak);
            setTotalRewards(data.totalRewards);
            setStakeVendorHut(data.VendorHut);
        } catch (error) {}
    };

    const getSwapHutAmount = async () => {
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/adminSwapDisplay');
            setSwapVendorHut([data.vendorHutAmount, data.vendorMaticAmount]);
            setTotalSwapSupplyHut(data.totalSupplyHut);
        } catch (error) {}
    };

    const getICOHutAmount = async () => {
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/IcoAdminDisplay');
            setICOTarget(data.targetAmount);
            setICOAmount(data.nowAmount);
            setICOVendorHut(data.hutAmount);
            setICOInvestor(data.investors);
            console.log(data);
        } catch (error) {}
    };

    const setFeeRate = async () => {
        if (!feeRateInput || feeRateInput > 100 || feeRateInput <= 0) return;
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/contract/setFeeRate', {
                rate: feeRateInput,
                account,
            });
            console.log(data);
            if (web3.web3) {
                try {
                    const feeRate = await web3?.web3.eth.sendTransaction(data);
                    const txData = {
                        amount: Number(feeRateInput),
                        type: 'FeeRate',
                        status: 'Success',
                        from: feeRate.from,
                        to: feeRate.to,
                        hash: feeRate.transactionHash,
                        saveType: 'feeRate',
                    };
                    // const {data : saveData} = await axios.post('http://13.125.251.97:8080/api/admin/tokenSave', {...txData});
                    return feeRate;
                } catch (error) {
                    console.error(error);
                    return error;
                }
            }
        } catch (error) {}
    };

    return (
        <AdminBox>
            <AdminSideBox>
                <div>
                    <div
                        className={` ${pageType == 'currency' ? 'bg-orange' : 'bg-grey'}`}
                        onClick={() => {
                            setPageType('currency');
                        }}
                    >
                        Currency
                    </div>
                    <div
                        className={` ${pageType == 'stake' ? 'bg-orange' : 'bg-grey'}`}
                        onClick={() => {
                            setPageType('stake');
                        }}
                    >
                        Stake
                    </div>
                    <div
                        className={` ${pageType == 'ico' ? 'bg-orange' : 'bg-grey'}`}
                        onClick={() => {
                            setPageType('ico');
                        }}
                    >
                        ICO
                    </div>
                    <div
                        className={` ${pageType == 'user' ? 'bg-orange' : 'bg-grey'}`}
                        onClick={() => {
                            setPageType('user');
                        }}
                    >
                        User
                    </div>
                </div>
            </AdminSideBox>
            <AdminMainBox>
                <AdminName>
                    <HoverFunction
                        className={'winStyle-fontGradient fg-gold ac-orange'}
                        text={web3.account || ''}
                        innerText={makeReducedString(web3.account || '')}
                    />{' '}
                    관리자님 안녕하세요
                </AdminName>

                <h2 className="winStyle-fontGradient fg-gold ac-orange">
                    {pageType == 'currency'
                        ? 'HUT 통화량 조절'
                        : pageType == 'stake'
                        ? '스테이크 가격 결정'
                        : pageType == 'user'
                        ? '유저정보'
                        : pageType == 'ico'
                        ? 'ICO'
                        : '디폴트'}
                </h2>
                {pageType == 'currency' && (
                    <>
                        <div>
                            <div>TotalStake : {totalStake}</div>
                            <div>TotalRewards : {totalRewards}</div>
                            <div>stakeVendorHut {stakeVendorHut}</div>
                            <div>
                                swapVendorHut <span>hut {swapVendorHut[0]}</span>
                                <span>matic {swapVendorHut[1]}</span> <span>total {totalSwapSupplyHut}</span>
                            </div>
                            <div>
                                icoVendorHut {icoVendorHut}{' '}
                                <div>
                                    얼마만큼 왔니 {icoAmount} / {icoTarget}
                                </div>
                                <div> 몇 명이 투자했을까 {icoInvestor}</div>
                            </div>
                        </div>
                        <AdminBtnBox>
                            <div className="adminBtn">
                                <div className="inputBox">
                                    <input
                                        placeholder="발행할 Swap HUT 수량 입력"
                                        className="adminInput fg-gold ac-orange"
                                        style={{ fontSize: '20px', fontWeight: '700' }}
                                        type="number"
                                        onInput={(e) => {
                                            setMakeInput(e.currentTarget.valueAsNumber);
                                        }}
                                    />
                                </div>
                                <div
                                    onClick={() => {
                                        dispatch(modalAsync({ ...modal, promiseFunc: makeHUT() }));
                                    }}
                                >
                                    발행하기
                                </div>
                            </div>
                            <div className="adminBtn">
                                <div className="inputBox">
                                    <input
                                        placeholder="발행할 Stake HUT 수량 입력"
                                        className="adminInput fg-gold ac-orange"
                                        style={{ fontSize: '20px', fontWeight: '700' }}
                                        type="number"
                                        onInput={(e) => {
                                            setMakeStakeInput(e.currentTarget.valueAsNumber);
                                        }}
                                    />
                                </div>
                                <div
                                    onClick={() => {
                                        dispatch(modalAsync({ ...modal, promiseFunc: makeStakeHUT() }));
                                    }}
                                >
                                    발행하기
                                </div>
                            </div>
                            <div className="adminBtn">
                                <div className="inputBox">
                                    <input
                                        placeholder="발행할 ICO HUT 수량 입력"
                                        className="adminInput fg-gold ac-orange"
                                        style={{ fontSize: '20px', fontWeight: '700' }}
                                        type="number"
                                        onInput={(e) => {
                                            setMakeICOInput(e.currentTarget.valueAsNumber);
                                        }}
                                    />
                                </div>
                                <div
                                    onClick={() => {
                                        dispatch(modalAsync({ ...modal, promiseFunc: makeICOHUT() }));
                                    }}
                                >
                                    발행하기
                                </div>
                            </div>
                            <div className="adminBtn">
                                <div className="inputBox">
                                    <input
                                        placeholder="없앨 HUT 통화량 입력"
                                        className="adminInput fg-gold ac-orange"
                                        style={{ fontSize: '20px', fontWeight: '700' }}
                                        type="number"
                                        onInput={(e) => {
                                            setBurnInput(e.currentTarget.valueAsNumber);
                                        }}
                                    />
                                </div>
                                <div onClick={() => dispatch(modalAsync({ ...modal, promiseFunc: burnHUT() }))}>
                                    태우기
                                </div>
                            </div>
                            <div className="adminBtn">
                                <div className="inputBox">
                                    <input
                                        placeholder="인출할 HUT 수량 입력"
                                        className="adminInput fg-gold ac-orange"
                                        style={{ fontSize: '20px', fontWeight: '700' }}
                                        type="number"
                                        onInput={(e) => {
                                            setWithdrawHUTInput(e.currentTarget.valueAsNumber);
                                        }}
                                    />
                                </div>
                                <div onClick={() => dispatch(modalAsync({ ...modal, promiseFunc: withdrawHUT() }))}>
                                    인출
                                </div>
                            </div>
                            <div className="adminBtn">
                                <div className="inputBox">
                                    <input
                                        placeholder="인출할 MATIC 수량 입력"
                                        className="adminInput fg-gold ac-orange"
                                        style={{ fontSize: '20px', fontWeight: '700' }}
                                        type="number"
                                        onInput={(e) => {
                                            setWithdrawMATICInput(e.currentTarget.valueAsNumber);
                                        }}
                                    />
                                </div>
                                <div onClick={() => dispatch(modalAsync({ ...modal, promiseFunc: withdrawMatic() }))}>
                                    인출
                                </div>
                            </div>
                        </AdminBtnBox>

                        <h2 className="winStyle-fontGradient fg-gold ac-orange">{'Fee Rate 설정'}</h2>
                        <AdminBtnBox>
                            <div className="adminBtn">
                                <div className="inputBox">
                                    <input
                                        placeholder="Fee Rate 수량 입력"
                                        className="adminInput fg-gold ac-orange"
                                        style={{ fontSize: '20px', fontWeight: '700' }}
                                        type="number"
                                        onInput={(e) => {
                                            setFeeRateInput(e.currentTarget.valueAsNumber);
                                        }}
                                    />
                                </div>
                                <div
                                    onClick={() => {
                                        dispatch(modalAsync({ ...modal, promiseFunc: setFeeRate() }));
                                    }}
                                >
                                    설정하기
                                </div>
                            </div>
                        </AdminBtnBox>

                        <TransactionFeeDiv className="winStyle-scroll">
                            <div>관리자에서 Mint, Burn, Withdraw한 트랜잭션 내역</div>
                            <TableHeaderDiv>
                                <div>유형</div>
                                <div>해시</div>
                                <div>상태</div>
                                <div>일자</div>
                            </TableHeaderDiv>
                            {adminTxList.map((item, index) => {
                                return (
                                    <TableDiv key={`${item}-${index}`}>
                                        <div>{item.type}</div>
                                        <div>
                                            <HoverFunction
                                                innerText={makeReducedString(item.hash)}
                                                text={item.hash}
                                            ></HoverFunction>
                                        </div>
                                        <div>{item.status}</div>
                                        <div>{makeDateString(item.createdAt)}</div>
                                    </TableDiv>
                                );
                            })}
                        </TransactionFeeDiv>
                    </>
                )}
                {pageType == 'stake' && (
                    <>
                        <StakeFilterBox>
                            <div>
                                <input
                                    type="text"
                                    placeholder="name, amount, kind"
                                    onInput={(e) => {
                                        setStakeFilterText(e.currentTarget.value);
                                    }}
                                />
                            </div>
                            <div
                                className={'increase'}
                                onClick={(e) => {
                                    if (e.currentTarget.classList.contains('increase')) {
                                        setStakingList(
                                            [...stakingList].sort((before, after) => before.price - after.price)
                                        );
                                    } else {
                                        setStakingList(
                                            [...stakingList].sort((before, after) => after.price - before.price)
                                        );
                                    }
                                    e.currentTarget.classList.toggle('increase');
                                }}
                            >
                                가격별
                            </div>
                            <div
                                className={'increase'}
                                onClick={(e) => {
                                    if (e.currentTarget.classList.contains('increase')) {
                                        setStakingList(
                                            [...stakingList].sort(
                                                (before, after) =>
                                                    before.createdAt?.getTime() - after.createdAt?.getTime()
                                            )
                                        );
                                    } else {
                                        setStakingList(
                                            [...stakingList].sort(
                                                (before, after) =>
                                                    after.createdAt?.getTime() - before.createdAt?.getTime()
                                            )
                                        );
                                    }
                                    e.currentTarget.classList.toggle('increase');
                                }}
                            >
                                일자별
                            </div>
                            <div>
                                <select onChange={(e) => setStakeFilterTime(e.currentTarget.value)}>
                                    <option defaultValue={'기간별'}>기간별</option>
                                    <option>1 day</option>
                                    <option>1 week</option>
                                    <option>1 month</option>
                                    <option>3 month</option>
                                    <option>6 month</option>
                                    <option>1 year</option>
                                </select>
                            </div>
                            <div
                                onClick={() => {
                                    const tempData = stakingList.map((item, index) => {
                                        if (item.name) {
                                            return {
                                                id: index,
                                                name: item.name || 'default',
                                                price: item.price || 'default',
                                                amount: item.amount || 'default',
                                                tokenId: item.tokenId || 'default',
                                                stakeStart: item.createdAt || 'default',
                                                kind: item.kind || 'default',
                                                dbId: item.id || 'default',
                                            };
                                        }
                                    });

                                    downloadExcelFile(tempData);
                                }}
                            >
                                엑셀파일 추출
                            </div>
                        </StakeFilterBox>
                        <AdminStakeBox>
                            <StakeListBox className="stakeList winStyle-scroll">
                                {stakingList
                                    .filter((item) => {
                                        return (
                                            item.name?.includes(stakeFilterText) ||
                                            Number(item.amount?.filter((item) => item !== 0).pop() || 0) ===
                                                Number(stakeFilterText) ||
                                            item.kind?.includes(stakeFilterText)
                                        );
                                    })
                                    .filter((item) => {
                                        const curDifference = getDateDifference(item.createdAt);
                                        switch (stakeFilterTime) {
                                            case '1 year': {
                                                if (curDifference.year <= 0) return item;
                                            }
                                            case '6 month': {
                                                if (curDifference.month <= 6 && curDifference.year <= 0) return item;
                                            }
                                            case '3 month': {
                                                if (curDifference.month <= 3 && curDifference.year <= 0) return item;
                                            }
                                            case '1 month': {
                                                if (curDifference.month <= 1 && curDifference.year <= 0) return item;
                                            }
                                            case '1 week': {
                                                if (
                                                    curDifference.day <= 7 &&
                                                    curDifference.month <= 0 &&
                                                    curDifference.year <= 0
                                                )
                                                    return item;
                                            }
                                            case '1 day': {
                                                if (
                                                    curDifference.day <= 0 &&
                                                    curDifference.month <= 0 &&
                                                    curDifference.year <= 0
                                                )
                                                    return item;
                                            }
                                            default:
                                                return item;
                                        }
                                    })
                                    .map((item, index) => {
                                        return (
                                            <div key={`${item.id}-${index}`}>
                                                <StakeListItem
                                                    name={item.name}
                                                    tokenId={item.tokenId}
                                                    average={item.average}
                                                    price={item.price}
                                                    amount={item.amount}
                                                    id={item.id}
                                                    kind={item.kind}
                                                    createdAt={item.createdAt}
                                                    setIsListUpdate={setIsListUpdate}
                                                    realAmount={item.nftId?.amount}
                                                />
                                            </div>
                                        );
                                    })}
                            </StakeListBox>
                        </AdminStakeBox>
                        <div>
                            <h2 className="winStyle-fontGradient fg-gold ac-orange">기간 / 수수료 설정</h2>
                            <ModalDurationListBox>
                                <li>
                                    <div>The Popular</div>
                                    <div>{stakeDurationList[0].duration} Months</div>
                                    <div>{stakeDurationList[0].charge}%</div>
                                </li>
                                <li>
                                    <div>The Regular</div>
                                    <div>{stakeDurationList[1].duration} Months</div>
                                    <div>{stakeDurationList[1].charge}%</div>
                                </li>
                                <li>
                                    <div>The Starter</div>
                                    <div>{stakeDurationList[2].duration} Months</div>
                                    <div>{stakeDurationList[2].charge}%</div>
                                </li>
                            </ModalDurationListBox>
                            <SetDurationBox>
                                <div>
                                    <div>
                                        <div>Duration</div>
                                        <input
                                            type="number"
                                            onInput={(e) => {
                                                const curValue = e.currentTarget.valueAsNumber;
                                                setStakeDurationList((state) => {
                                                    const temp = [...state];
                                                    temp[0] = { duration: curValue, charge: temp[0].charge };
                                                    return temp;
                                                });
                                            }}
                                            placeholder={stakeDurationList[0].duration.toString()}
                                        />
                                    </div>
                                    <div>
                                        <div>Charge</div>
                                        <input
                                            type="number"
                                            onInput={(e) => {
                                                const curValue = e.currentTarget.valueAsNumber;
                                                setStakeDurationList((state) => {
                                                    const temp = [...state];
                                                    temp[0] = { duration: temp[0].duration, charge: curValue };
                                                    return temp;
                                                });
                                            }}
                                            placeholder={stakeDurationList[0].charge.toString()}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <div>Duration</div>
                                        <input
                                            type="number"
                                            onInput={(e) => {
                                                const curValue = e.currentTarget.valueAsNumber;
                                                setStakeDurationList((state) => {
                                                    const temp = [...state];
                                                    temp[1] = { duration: curValue, charge: temp[1].charge };
                                                    return temp;
                                                });
                                            }}
                                            placeholder={stakeDurationList[1].duration.toString()}
                                        />
                                    </div>
                                    <div>
                                        <div>Charge</div>
                                        <input
                                            type="number"
                                            onInput={(e) => {
                                                const curValue = e.currentTarget.valueAsNumber;
                                                setStakeDurationList((state) => {
                                                    const temp = [...state];
                                                    temp[1] = { duration: temp[1].duration, charge: curValue };
                                                    return temp;
                                                });
                                            }}
                                            placeholder={stakeDurationList[1].charge.toString()}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <div>Duration</div>
                                        <input
                                            type="number"
                                            onInput={(e) => {
                                                const curValue = e.currentTarget.valueAsNumber;
                                                setStakeDurationList((state) => {
                                                    const temp = [...state];
                                                    temp[2] = { duration: curValue, charge: temp[2].charge };
                                                    return temp;
                                                });
                                            }}
                                            placeholder={stakeDurationList[2].duration.toString()}
                                        />
                                    </div>
                                    <div>
                                        <div>Charge</div>
                                        <input
                                            type="number"
                                            onInput={(e) => {
                                                const curValue = e.currentTarget.valueAsNumber;
                                                setStakeDurationList((state) => {
                                                    const temp = [...state];
                                                    temp[2] = { duration: temp[2].duration, charge: curValue };
                                                    return temp;
                                                });
                                            }}
                                            placeholder={stakeDurationList[2].charge.toString()}
                                        />
                                    </div>
                                </div>
                            </SetDurationBox>
                            <ChangeBtn
                                onClick={() => {
                                    dispatch(modalAsync({ ...modal, promiseFunc: updateDBDurationAndCharge() }));
                                }}
                            >
                                Update
                            </ChangeBtn>
                        </div>
                    </>
                )}
                {pageType == 'user' && (
                    <>
                        <UserInputBox>
                            <input
                                type="text"
                                placeholder="type / hash / account"
                                onInput={(e) => {
                                    setUserFilterText(e.currentTarget.value);
                                }}
                            />
                        </UserInputBox>
                        <TransactionFeeDiv className="winStyle-scroll">
                            <div>유저가 Stake, Swap한 트랜잭션 내역</div>
                            <TableHeaderDiv>
                                <div>유형</div>
                                <div>해시</div>
                                <div>지갑</div>
                                <div>상태</div>
                                <div
                                    onClick={(e) => {
                                        setUserTxList([...userTxList].reverse());
                                    }}
                                >
                                    일자
                                </div>
                            </TableHeaderDiv>
                            {userTxList
                                .filter((item) => {
                                    if (
                                        item.hash.toUpperCase().includes(userFilterText.toUpperCase()) ||
                                        item.from.toUpperCase().includes(userFilterText.toUpperCase()) ||
                                        item.type.toUpperCase().includes(userFilterText.toUpperCase()) ||
                                        item.status.includes(userFilterText)
                                    )
                                        return item;
                                })
                                .map((item, index) => {
                                    return (
                                        <TableDiv key={`${item}-${index}`}>
                                            <div>{item.type}</div>
                                            <div>
                                                <HoverFunction
                                                    innerText={makeReducedString(item.hash)}
                                                    text={item.hash}
                                                ></HoverFunction>
                                            </div>
                                            <div>
                                                <HoverFunction
                                                    innerText={makeReducedString(item.from)}
                                                    text={item.from}
                                                ></HoverFunction>
                                            </div>
                                            <div>{item.status}</div>
                                            <div>{makeDateString(item.createdAt)}</div>
                                        </TableDiv>
                                    );
                                })}
                        </TransactionFeeDiv>
                    </>
                )}
                {pageType == 'ico' && (
                    <>
                        <div>{(icoAmount * 100) / icoTarget} % 의 목표액 달성</div>
                        <div> {icoInvestor || 0} 명의 투자</div>
                        <ReachedGoalComponent
                            data-title={'정산하기'}
                            className={`winStyle-button ${icoAmount <= icoTarget && 'off'}`}
                        >
                            정산버튼
                        </ReachedGoalComponent>
                    </>
                )}
            </AdminMainBox>
        </AdminBox>
    );
};

export default Admin;

const AdminBox = styled.div`
    width: 100%;
    padding: 50px 10%;
    position: relative;
    display: flex;
    justify-content: space-between;
    & .inputBox {
        position: relative;
        width: 100%;
    }
    & .adminInput {
        position: relative;
        outline: none;
        border: none;
        background-color: transparent;
        border-radius: 10px;
        padding: 5px;
        width: 100%;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        &:focus {
            color: white;
            outline: none;
            box-shadow: none;
        }
        & input::-webkit-input-placeholder,
        & input::-ms-input-placeholder {
            color: red;
        }
    }
`;
const AdminSideBox = styled.div`
    width: 20%;
    position: relative;
    & > div {
        display: flex;
        width: 100%;
        position: sticky;
    }

    & > div:first-child {
        flex-basis: 20%;
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 20px;

        & > div {
            width: 100%;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            background-color: var(--grey);

            &:hover {
                background-color: var(--middlegrey);
                color: white;
            }

            &.bg-orange {
                background-color: var(--orange);
                color: white;
            }
        }
    }

    & > div:last-child {
        flex-basis: 80%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
`;

const AdminBtnBox = styled.div`
    width: 80%;
    display: flex;
    justify-content: left;
    align-items: left;
    flex-direction: column;
    row-gap: 20px;
    padding-bottom: 50px;
    border-radius: 15px;
    & .adminBtn {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        column-gap: 20px;
        padding: 20px 5%;
        border: 1px solid var(--grey);
        border-radius: 15px;

        & > div {
            &:last-child {
                min-width: 120px;
                cursor: pointer;
                padding: 18px 0;
                color: var(--light);
                font-weight: 600;
                background-color: var(--orange);
                &:hover {
                    background-color: var(--purple);
                }
            }
            background-color: var(--middlegrey);
            padding: 10px;
            border-radius: 5px;
        }
    }
`;

const AdminMainBox = styled.div`
    width: 70%;
    h2 {
        font-size: 1.5rem;
        width: fit-content;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
`;

const AdminName = styled.div`
    margin-bottom: 20px;
    border-bottom: 1px solid var(--grey);
    padding-bottom: 10px;
    text-align: right;
`;

const TransactionFeeDiv = styled.div`
    width: 100%;
    padding-right: 20px;
    & > div {
        margin: 1rem 0;
        color: #9e9e9e;
        font-weight: 700;
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
        width: 30%;
        color: #9e9e9e;
    }
    & > div:nth-child(4) {
        width: 20%;
        text-align: right;
        color: #9e9e9e;
    }
    & > div:nth-child(5) {
        width: 30%;
        color: #9e9e9e;
        text-align: right;
        &:hover {
            color: var(--blue);
            cursor: pointer;
        }
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
        color: #bdbdbd;
    }
    & > div:nth-child(3) {
        width: 30%;
        color: #bdbdbd;
    }
    & > div:nth-child(4) {
        width: 20%;
        text-align: right;
        color: #bdbdbd;
    }
    & > div:nth-child(5) {
        width: 30%;
        text-align: right;
        color: #bdbdbd;
    }
`;

const AdminStakeBox = styled.div`
    margin-bottom: 50px;
`;

const StakeListBox = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    margin: auto;
    width: 100%;

    & .close {
        & > div ~ div {
            display: none;
        }
    }
    & > div > div {
        width: 100%;
        display: flex;
        flex-direction: column;

        & > div {
            display: flex;
            column-gap: 20px;
            width: 100%;
            padding: 10px 0;
            &:last-child {
                background-color: var(--grey);
            }
        }
    }
`;

const UserInputBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: right;
    padding-right: 20px;
    input {
        text-align: right;
        padding: 3px 10px;
    }
`;

const StakeFilterBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: right;
    & > div {
        padding: 3px 5px;
        border: 1px solid var(--grey);
        &:hover {
            background-color: var(--light);
            color: var(--grey);
        }
    }
    margin-bottom: 20px;
`;

const ModalDurationListBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > li {
        border-radius: 5px;
        padding: 19px;
        padding-top: 120px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        row-gap: 9px;
        width: 30%;
        border: 1px solid var(--grey);
        cursor: pointer;
        &.selectedDuration {
            border: 1px solid var(--gold);
        }
        &:nth-child(1) {
            background: url('/img/Coin1.png');
        }
        &:nth-child(2) {
            background: url('/img/Coin2.png');
        }
        &:nth-child(3) {
            background: url('/img/Coin3.png');
        }
        &:nth-child(n) {
            background-repeat: no-repeat;
            background-size: contain;
            background-position: 0 -20px;
        }

        &:hover {
            border: 1px solid var(--gold);
        }
        &:active {
            border: 1px solid var(--grey);
        }
        & > div:nth-child(1) {
            font-size: 12px;
            color: var(--middlegrey);
        }
        & > div:nth-child(2) {
            font-size: 14px;
        }
        & > div:nth-child(3) {
            font-size: 36px;
            font-weight: 1000;
        }
    }
`;

const SetDurationBox = styled.div`
    margin-top: 20px;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    column-gap: 15%;
    & > div {
        text-align: right;
        width: 80/3%;
        display: flex;
        flex-direction: column;
        row-gap: 20px;
        input {
            text-align: right;
            padding: 3px 8px;
        }
    }
`;

const ChangeBtn = styled.div`
    margin-top: 50px;
    background-color: var(--orange);
    color: var(--white);
    font-size: 1rem;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    width: 30%;
    float: right;
    &:hover {
        background-color: var(--purple);
    }
`;

const ReachedGoalComponent = styled.div`
    width: 100px;
    padding: 10px 0;
    border: 1px solid grey;
    &.off {
        pointer-events: none;
    }
`;
