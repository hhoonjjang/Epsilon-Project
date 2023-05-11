import styled from 'styled-components';
import axios from 'axios';
import { useEffect, useState } from 'react';

import SideBar from '@/components/Menu/SideBar';
import BatchContentsCard from '@/components/BatchCard/BatchContentsCard';
import IBatchContents from '@/interface/IBatch.interface';

const BatchPage = ({ web3, account }: { web3: any; account: string }) => {
    const [myNFTData, setMyNFTData] = useState<[obj: IBatchContents] | []>([]);
    const getNFTData = async () => {
        const data = await axios.post('http://13.125.251.97:8080/api/nft/myNFTs', { account });
        setMyNFTData((state) => (state = data.data));
        return data.data;
    };
    const [durationData, setDurationData] = useState<number[]>([]);

    const getDurationData = async () => {
        try {
            const { data } = await axios.get('http://13.125.251.97:8080/api/admin/durationOnly');
            setDurationData((state) => (state = data.sort((a: number, b: number) => a - b)));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (account) {
            getNFTData();
            getDurationData();
            console.log(durationData);
        }
    }, [account]);

    return (
        <NFTsBox>
            <SideBar />
            <MainBox>
                <BatchContentsCard data={myNFTData} account={account} web3={web3} durationData={durationData} />
            </MainBox>
        </NFTsBox>
    );
};

export default BatchPage;

const NFTsBox = styled.div`
    position: relative;
    margin: 0 10%;
    margin-bottom: 150px;
    width: 80%;
    display: flex;
    justify-content: center;
`;
const MainBox = styled.div`
    width: 75%;
    & > div {
        margin: 30px 0;
    }
`;
