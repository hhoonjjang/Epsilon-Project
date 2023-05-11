import styled from 'styled-components';
import Divider from '@mui/material/Divider';
import OverviewICO from './OverviewICO';
import OverviewStake from './OverviewStake';
import OverviewSwap from './OverviewSwap';
import OverviewTransaction from './OverviewTransaction';

interface IProps {
    title: string;
}

const OverviewCard = ({ title }: IProps) => {
    return (
        <OverviewBox>
            <TitleBox>{title}</TitleBox>
            <Divider />
            {title == 'ICO' && <OverviewICO />}
            {title == 'Stake' && <OverviewStake />}
            {title == 'Swap' && <OverviewSwap />}
            {title == 'Transactions' && <OverviewTransaction />}
        </OverviewBox>
    );
};

export default OverviewCard;

const OverviewBox = styled.div`
    width: 100%;
`;
const TitleBox = styled.div`
    font-weight: 600;
    font-size: 1.5rem;
    padding-bottom: 20px;
`;
