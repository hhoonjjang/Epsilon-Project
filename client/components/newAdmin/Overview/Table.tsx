import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { makeDateString } from '@/module/tools';
import ITransactionList from '@/interface/ITransactionList.inerface';
import { makeReducedString } from '@/module/tools';
import HoverFunction from '@/module/HoverFunction';

interface CustomTableProps {
    data: ITransactionList[];
}

const CustomTable = ({ data }: CustomTableProps) => {
    return (
        <TableContainer component={Paper} sx={{ maxHeight: '600px', mt: '20px' }}>
            <Table sx={{ minWidth: 650 }} aria-label="customized table">
                <TableHead sx={{ backgroundColor: 'var(--lightgrey)' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                            Hash
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                            From
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                            To
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                            Status
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                            Date
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => {
                        return (
                            <TableRow
                                key={`${row.type}-${row.from}-${row.to}-${row.status}-${row.createdAt}-${index}`}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.type}
                                </TableCell>
                                <TableCell align="right">
                                    {
                                        <HoverFunction
                                            innerText={makeReducedString(row.hash)}
                                            text={row.hash}
                                        ></HoverFunction>
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    {
                                        <HoverFunction
                                            innerText={makeReducedString(row.from)}
                                            text={row.from}
                                        ></HoverFunction>
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    {
                                        <HoverFunction
                                            innerText={makeReducedString(row.to)}
                                            text={row.to}
                                        ></HoverFunction>
                                    }
                                </TableCell>
                                <TableCell align="right">{row.status}</TableCell>
                                <TableCell align="right">{makeDateString(row.createdAt)}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CustomTable;
