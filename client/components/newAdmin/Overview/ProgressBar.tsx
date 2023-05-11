import { styled } from '@mui/material/styles';
import { LinearProgress, Tooltip } from '@mui/material';

interface CustomProgressBarProps {
    value: number;
    goal: number;
}

const CustomProgressBar = ({ value, goal }: CustomProgressBarProps) => {
    const percentage = (value / goal) * 100;
    const barColor = percentage >= 100 ? '#00c853' : '#1976d2'; // 초과 시 초록색, 미만 시 파란색

    const CustomBar = styled(LinearProgress)({
        height: 50,
        borderRadius: 10,
        backgroundColor: '#d8d8d8',
        '& .MuiLinearProgress-bar': {
            borderRadius: 10,
            backgroundColor: barColor,
        },
    });

    return (
        <Tooltip arrow title={`${percentage.toFixed(2)}%`} aria-label={`${percentage.toFixed(2)}%`} placement={'top'}>
            <CustomBar variant="determinate" value={percentage} />
        </Tooltip>
    );
};

export default CustomProgressBar;
