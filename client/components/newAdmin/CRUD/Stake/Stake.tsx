import { Box, Grid, Paper } from '@mui/material';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useState, useEffect, forwardRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { makeDateString } from '@/module/tools';
import Tooltip from '@mui/material/Tooltip';
import { getDateDifference } from '@/module/tools';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import DurationAndChargeComp from './DurationAndChargeComp';
import { setDurationAndChargeArray } from '@/module/features/durationAndCharge';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import UpdatePriceItem from './UpdatePriceItem';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

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

interface IStakingData {
    name: string;
    tokenId: number;
    kind: string;
    price: number;
    amount: number[];
    createdAt: Date;
    id: string;
}
interface tokenBalance {
    duration: number;
    charge: number;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Stake = ({ web3, account }: { web3: any; account: string }) => {
    const [stakingList, setStakingList] = useState<Array<IStakingItem>>([]);
    const [stakingRows, setStakingRows] = useState<Array<IStakingData>>([]);
    const [priceSort, setPriceSort] = useState<boolean>(false);
    const [amountSort, setAmountSort] = useState<boolean>(false);
    const [tokenIdSort, setTokenIdSort] = useState<boolean>(false);
    const [stakeFilterText, setStakeFilterText] = useState<string>('');
    const [stakeFilterTime, setStakeFilterTime] = useState<string>('기간별');
    const excelFileName = `${makeDateString(Date.now().toString())}_${account}`;
    const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const excelFileExtension = '.xlsx';
    const [curDurationAndCharge, setCurDurationAndCharge] = useState<Array<tokenBalance>>([
        { duration: 0, charge: 0 },
        { duration: 0, charge: 0 },
        { duration: 0, charge: 0 },
    ]);
    const dispatch = useAppDispatch();
    const durationAndCharge = useAppSelector((state) => state.durationAndCharge);
    const [isListUpdate, setIsListUpdate] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);

    const handleClick = (type: string) => {
        console.log(type);
        if (type == 'success') {
            setOpen(true);
        } else if (type == 'error') {
            setErrorOpen(true);
        }
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
        setOpen(false);
    };

    function createStakingData(
        name: string,
        tokenId: number,
        kind: string,
        price: number,
        amount: number[],
        createdAt: Date,
        id: string
    ) {
        return { name, tokenId, kind, price, amount, createdAt, id };
    }

    const setDurationAndCharge = () => {
        dispatch(setDurationAndChargeArray(curDurationAndCharge));
        updateDBDurationAndCharge();
    };

    const updateDBDurationAndCharge = async () => {
        try {
            const { data } = await axios.post('http://13.125.251.97:8080/api/admin/updateDurationAndCharge', {
                stakeDurationList: curDurationAndCharge,
            });
            handleClick('success');
            console.log(data);
            return data;
        } catch (error) {
            handleClick('error');
            return error;
        }
    };

    useEffect(() => {
        setCurDurationAndCharge(durationAndCharge);
    }, [durationAndCharge]);
    useEffect(() => {
        console.log(curDurationAndCharge);
    }, [curDurationAndCharge]);

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

    useEffect(() => {
        getStakingList();
    }, [isListUpdate]);
    useEffect(() => {
        console.log(stakingList.length);
    }, [stakingList]);

    const getStakingList = async () => {
        try {
            const { data } = await axios.get('http://13.125.251.97:8080/api/admin/stakingList');
            let rowData: IStakingData[] = [];

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
                rowData = [
                    ...rowData,
                    createStakingData(
                        item.nftId?.name,
                        item.nftId?.tokenId,
                        item.nftId?.kind,
                        item.price,
                        item.amount,
                        item.createdAt,
                        item._id
                    ),
                ];
            });
            setStakingRows(rowData);
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const getDurationAndCharge = async () => {
        try {
            const { data } = await axios.get('http://13.125.251.97:8080/api/admin/duration');
            console.log(data);
        } catch (error) {}
    };

    useEffect(() => {
        getStakingList();
        getDurationAndCharge();
    }, []);

    useEffect(() => {
        setStakingList((state) => [...state]);
    }, [stakeFilterTime]);

    return (
        <StakeBox>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    This is a success message!
                </Alert>
            </Snackbar>
            <Snackbar open={errorOpen} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    This is a error message!
                </Alert>
            </Snackbar>
            <Paper
                elevation={3}
                sx={{ padding: '20px 0px 20px 20px', fontSize: '2rem', fontWeight: '600', color: 'var(--blue)' }}
            >
                Stake
            </Paper>
            <Divider />
            <Grid container gap={2} className={'topCardsContainer'}>
                <Grid marginY={2}>
                    <Paper className={'dataCard'} elevation={3}>
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'flex',
                                justifyContent: 'right',
                                pr: '20px',
                                mb: '20px',
                                columnGap: '20px',
                            }}
                        >
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120, padding: '8px 0' }}>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={stakeFilterTime}
                                    onChange={(e: SelectChangeEvent) => {
                                        setStakeFilterTime(e.target.value);
                                        console.log(e.target.value);
                                    }}
                                    label="기간별"
                                >
                                    <MenuItem value="기간별">
                                        <em>기간별</em>
                                    </MenuItem>
                                    <MenuItem value={'1 day'}>1 day</MenuItem>
                                    <MenuItem value={'1 week'}>1 week</MenuItem>
                                    <MenuItem value={'1 month'}>1 month</MenuItem>
                                    <MenuItem value={'3 month'}>3 month</MenuItem>
                                    <MenuItem value={'6 month'}>6 month</MenuItem>
                                    <MenuItem value={'1 year'}>1 year</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                sx={{ right: 0, width: '30%' }}
                                id="standard-search"
                                label="Search field (name / amount / kind)"
                                variant="standard"
                                type="search"
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    console.log(e.target.value);
                                    if (!e.target.value) {
                                        setStakeFilterText('');
                                        return;
                                    } else setStakeFilterText(e.target.value);
                                }}
                            />
                        </Paper>
                        <TableContainer component={Paper} sx={{ maxHeight: '500px', overflowY: 'scroll' }}>
                            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                <TableHead sx={{ backgroundColor: 'var(--lightgrey)' }}>
                                    <TableRow>
                                        <Tooltip
                                            title={`NFT 이름`}
                                            placement={'top'}
                                            arrow
                                            enterDelay={200}
                                            leaveDelay={300}
                                        >
                                            <TableCell sx={{ fontWeight: '600' }}>Name</TableCell>
                                        </Tooltip>
                                        <Tooltip
                                            title={`토큰 아이디`}
                                            placement={'top'}
                                            arrow
                                            enterDelay={200}
                                            leaveDelay={300}
                                        >
                                            <TableCell
                                                align="right"
                                                sx={{ '&:hover': { color: 'var(--blue)' }, fontWeight: '600' }}
                                                onClick={() => {
                                                    setTokenIdSort((state) => !state);
                                                    if (tokenIdSort) {
                                                        setStakingRows(
                                                            [...stakingRows].sort(
                                                                (before, after) => before.tokenId - after.tokenId
                                                            )
                                                        );
                                                    } else {
                                                        setStakingRows(
                                                            [...stakingRows].sort(
                                                                (before, after) => after.tokenId - before.tokenId
                                                            )
                                                        );
                                                    }
                                                    setPriceSort((state) => !state);
                                                }}
                                            >
                                                TokenId
                                            </TableCell>
                                        </Tooltip>
                                        <Tooltip
                                            title={`Wiskey 종류`}
                                            placement={'top'}
                                            arrow
                                            enterDelay={200}
                                            leaveDelay={300}
                                        >
                                            <TableCell align="right" sx={{ fontWeight: '600' }}>
                                                kind
                                            </TableCell>
                                        </Tooltip>
                                        <Tooltip
                                            title={`관리자가 지정한 가격`}
                                            placement={'top'}
                                            arrow
                                            enterDelay={200}
                                            leaveDelay={300}
                                        >
                                            <TableCell
                                                sx={{ '&:hover': { color: 'var(--blue)' }, fontWeight: '600' }}
                                                align="right"
                                                onClick={() => {
                                                    if (priceSort) {
                                                        setStakingRows(
                                                            [...stakingRows].sort(
                                                                (before, after) => before.price - after.price
                                                            )
                                                        );
                                                    } else {
                                                        setStakingRows(
                                                            [...stakingRows].sort(
                                                                (before, after) => after.price - before.price
                                                            )
                                                        );
                                                    }
                                                    setPriceSort((state) => !state);
                                                }}
                                            >
                                                price
                                            </TableCell>
                                        </Tooltip>
                                        <Tooltip
                                            title={`최근가`}
                                            placement={'top'}
                                            arrow
                                            enterDelay={200}
                                            leaveDelay={300}
                                        >
                                            <TableCell
                                                align="right"
                                                sx={{ '&:hover': { color: 'var(--blue)' }, fontWeight: '600' }}
                                                onClick={() => {
                                                    setAmountSort((state) => !state);
                                                    if (amountSort) {
                                                        setStakingRows(
                                                            [...stakingRows].sort((before, after) => {
                                                                const beforeAmount = before.amount;
                                                                let beforeLatestPrice;
                                                                let afterLatestPrice;
                                                                if (Array.isArray(beforeAmount)) {
                                                                    beforeLatestPrice =
                                                                        [...beforeAmount].reduce(
                                                                            (acc, cur) => acc + cur,
                                                                            0
                                                                        ) / beforeAmount.length;
                                                                }
                                                                const afterAmount = after.amount;
                                                                if (Array.isArray(afterAmount)) {
                                                                    afterLatestPrice =
                                                                        [...afterAmount].reduce(
                                                                            (acc, cur) => acc + cur,
                                                                            0
                                                                        ) / afterAmount.length;
                                                                }
                                                                if (
                                                                    typeof beforeLatestPrice == 'number' &&
                                                                    typeof afterLatestPrice == 'number'
                                                                )
                                                                    return beforeLatestPrice - afterLatestPrice;
                                                                else return 0;
                                                            })
                                                        );
                                                    } else {
                                                        setStakingRows(
                                                            [...stakingRows].sort(
                                                                (before, after) => after.price - before.price
                                                            )
                                                        );
                                                    }
                                                    setPriceSort((state) => !state);
                                                }}
                                            >
                                                amount
                                            </TableCell>
                                        </Tooltip>
                                        <Tooltip
                                            title={`Stake 시점`}
                                            placement={'top'}
                                            arrow
                                            enterDelay={200}
                                            leaveDelay={300}
                                        >
                                            <TableCell align="right" sx={{ fontWeight: '600' }}>
                                                createdAt
                                            </TableCell>
                                        </Tooltip>
                                        <Tooltip
                                            title={`관리자 가격 지정`}
                                            placement={'top'}
                                            arrow
                                            enterDelay={200}
                                            leaveDelay={300}
                                        >
                                            <TableCell align="right" sx={{ fontWeight: '600' }}>
                                                update price
                                            </TableCell>
                                        </Tooltip>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stakingRows
                                        .filter((item) => {
                                            return (
                                                item.name?.includes(stakeFilterText) ||
                                                Number(item.amount?.filter((item) => item !== 0).pop() || 0) ===
                                                    Number(stakeFilterText) ||
                                                item.kind?.includes(stakeFilterText)
                                            );
                                        })
                                        .filter((item) => {
                                            const curDifference = getDateDifference(new Date(item.createdAt));
                                            console.log(
                                                curDifference.day <= 0 &&
                                                    curDifference.month <= 0 &&
                                                    curDifference.year <= 0
                                            );
                                            switch (stakeFilterTime) {
                                                case '1 year': {
                                                    if (curDifference.year <= 0) return item;
                                                }
                                                case '6 month': {
                                                    if (curDifference.month <= 6 && curDifference.year <= 0)
                                                        return item;
                                                }
                                                case '3 month': {
                                                    if (curDifference.month <= 3 && curDifference.year <= 0)
                                                        return item;
                                                }
                                                case '1 month': {
                                                    if (curDifference.month <= 1 && curDifference.year <= 0)
                                                        return item;
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
                                                    ) {
                                                        console.log('들왔다');
                                                        return item;
                                                    }
                                                }
                                                default:
                                                    return item;
                                            }
                                        })
                                        .map((row, index) => {
                                            if (!row.name) return;
                                            const curAmount = row.amount;
                                            let curLatestPrice;
                                            if (Array.isArray(curAmount)) {
                                                curLatestPrice =
                                                    [...curAmount].reduce((acc, cur) => acc + cur, 0) /
                                                    curAmount.length;
                                            }
                                            return (
                                                <TableRow
                                                    key={`${row.name}-${index}`}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="right">{row.tokenId}</TableCell>
                                                    <TableCell align="right">{row.kind}</TableCell>
                                                    <TableCell align="right">{row.price}</TableCell>
                                                    <TableCell align="right">{curLatestPrice}</TableCell>
                                                    <TableCell align="right">
                                                        {makeDateString(row.createdAt?.toString())}
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            flexDirection: 'row',
                                                            justifyContent: 'right',
                                                        }}
                                                    >
                                                        <UpdatePriceItem
                                                            name={row.name}
                                                            price={row.price}
                                                            id={row.id}
                                                            setIsListUpdate={setIsListUpdate}
                                                            handleClick={handleClick}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    <Paper elevation={0} sx={{ display: 'flex', justifyContent: 'right', pr: '20px' }}>
                        <Button
                            sx={{ height: '40px' }}
                            variant="contained"
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
                            Extract Excel
                        </Button>
                    </Paper>
                </Grid>
                <Grid marginY={2}>
                    <Paper className={'dataCard'} elevation={3}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                flexWrap: 'wrap',
                                '& > :not(style)': {
                                    m: 1,
                                },
                            }}
                        >
                            <Paper
                                className={'header'}
                                sx={{
                                    width: '100%',
                                    marginBottom: '50px',
                                    padding: '20px 0',
                                    fontSize: '1.5rem',
                                    pl: '20px',
                                }}
                            >
                                Duration and Charge
                            </Paper>

                            <Paper
                                elevation={3}
                                sx={{
                                    justifyContent: 'space-between',
                                    display: 'flex',
                                    alignItems: 'center',
                                    pl: '15px',
                                    padding: '40px 20px',
                                }}
                            >
                                <DurationAndChargeComp
                                    index={0}
                                    setCurDurationAndCharge={setCurDurationAndCharge}
                                    curDurationAndCharge={curDurationAndCharge}
                                />
                                <DurationAndChargeComp
                                    index={1}
                                    setCurDurationAndCharge={setCurDurationAndCharge}
                                    curDurationAndCharge={curDurationAndCharge}
                                />
                                <DurationAndChargeComp
                                    index={2}
                                    setCurDurationAndCharge={setCurDurationAndCharge}
                                    curDurationAndCharge={curDurationAndCharge}
                                />
                                <Button
                                    sx={{ height: '40px' }}
                                    variant="contained"
                                    onClick={() => {
                                        setDurationAndCharge();
                                    }}
                                >
                                    Set Duration And Charge
                                </Button>
                            </Paper>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </StakeBox>
    );
};

export default Stake;

const StakeBox = styled(Box)`
    .topCardsContainer {
        display: grid;
        grid-template-columns: 1fr;

        @media screen and (min-width: 768px) {
            grid-template-columns: repeat(1, 1fr);
        }
    }
    .dataCard {
        padding: 20px;
    }
`;
