import OverviewCard from './OverviewCard';
import { Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Overview = () => {
    return (
        <OverviewBox>
            <Paper sx={{ padding: '20px 0px 20px 20px', fontSize: '2rem', fontWeight: '600', color: 'var(--blue)' }}>
                OverView
            </Paper>
            <Grid container gap={2} className={'topCardsContainer'}>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <OverviewCard title={'ICO'} />
                    </Paper>
                </Grid>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <OverviewCard title={'Stake'} />
                    </Paper>
                </Grid>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <OverviewCard title={'Swap'} />
                    </Paper>
                </Grid>
                <Grid marginY={2}>
                    <Paper className={'dataCard'}>
                        <OverviewCard title={'Transactions'} />
                    </Paper>
                </Grid>
            </Grid>
        </OverviewBox>
    );
};

export default Overview;

const OverviewBox = styled(Box)`
    .topCardsContainer {
        display: grid;
        grid-template-columns: 1fr;

        @media screen and (min-width: 768px) {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    .dataCard {
        padding: 20px;
    }
`;
