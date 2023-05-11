import { useState, useEffect } from 'react';
import axios from 'axios';
import ITransactionList from '@/interface/ITransactionList.inerface';
import { Box, Paper } from '@mui/material';
import TextField from '@mui/material/TextField';
import CustomTable from '../../Overview/Table';

const Admin = () => {
    const [adminTxList, setAdminTxList] = useState<Array<ITransactionList>>([]);
    const [adminFilterText, setAdminFilterText] = useState<string>('');

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

    useEffect(() => {
        getAdminTxFunc();
    }, []);

    useEffect(() => {
        console.log(adminTxList);
    }, [adminTxList]);

    return (
        <div>
            <Box>
                <Paper
                    elevation={3}
                    sx={{ padding: '20px 0px 20px 20px', fontSize: '2rem', fontWeight: '600', color: 'var(--blue)' }}
                >
                    Admin Transactions
                </Paper>
                <TextField
                    sx={{ right: 0 }}
                    id="standard-search"
                    label={`type / hash / account`}
                    variant="standard"
                    type="text"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        console.log(e.target.value);
                        setAdminFilterText(e.target.value);
                    }}
                />
            </Box>
            <Box>
                <CustomTable
                    data={adminTxList.filter((item) => {
                        if (
                            item.hash.toUpperCase().includes(adminFilterText.toUpperCase()) ||
                            item.from.toUpperCase().includes(adminFilterText.toUpperCase()) ||
                            item.type.toUpperCase().includes(adminFilterText.toUpperCase()) ||
                            item.status.includes(adminFilterText)
                        )
                            return {
                                type: item.type,
                                from: item.from,
                                to: item.to,
                                status: item.status,
                                createdAt: item.createdAt,
                            };
                    })}
                />
            </Box>
        </div>
    );
};

export default Admin;
