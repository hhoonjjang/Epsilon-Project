import axios from 'axios';
import { useState, useEffect } from 'react';
import CustomBarChart from './BarChart';
import MyCustomBarChart from './CustomBarChart';

const OverviewTransaction = () => {
    const [adminTxList, setAdminTxList] = useState<Array<any>>([]);
    const [userTxList, setUserTxList] = useState<Array<any>>([]);
    const colors = ['#FF6633', 'var(--dark)', 'var(--lightgrey)', 'var(--blue)', '#00B3E6'];

    const getAdminTxFunc = async () => {
        try {
            const { data } = await axios.get('http://13.125.251.97:8080/api/admin/transactionList');
            const kinds = Array.from(new Set(data.map((item: any) => item.type)));
            const kindCount = kinds.reduce((acc: Object, type: any) => {
                const count = data.filter((item: any) => {
                    return item.type === type;
                }).length;
                return { ...acc, [type]: count };
            }, {});
            const kindArray = Object.entries(kindCount).reduce((acc: any, [type, count]) => {
                if (type) return [...acc, { type, count }];
                return acc;
            }, []);
            setAdminTxList(kindArray);

            return kindArray;
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    const getUserTxFunc = async () => {
        try {
            const { data } = await axios.get('http://13.125.251.97:8080/api/admin/userTransactionList');
            const kinds = Array.from(new Set(data.map((item: any) => item.type)));
            const kindCount = kinds.reduce((acc: Object, type: any) => {
                const count = data.filter((item: any) => {
                    return item.type === type;
                }).length;
                return { ...acc, [type]: count };
            }, {});
            const kindArray = Object.entries(kindCount).reduce((acc: any, [type, count]) => {
                if (type) return [...acc, { type, count }];
                return acc;
            }, []);
            const adminListData = await getAdminTxFunc();
            setUserTxList([...kindArray, ...adminListData].sort((a, b) => b.count - a.count));
            return data;
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    useEffect(() => {
        getUserTxFunc();
    }, []);

    useEffect(() => {
        console.log(adminTxList, userTxList);
    }, [adminTxList, userTxList]);

    return (
        <div>
            <MyCustomBarChart data={userTxList} colors={colors} dataKey="count" />
        </div>
    );
};

export default OverviewTransaction;
