import * as React from 'react';
import { PieChart, Pie, Sector, Cell, PieProps, Tooltip, Legend, TooltipProps } from 'recharts';
import { styled } from '@mui/material/styles';

interface PieChartData {
    kind: string;
    count: number;
}

interface CustomPieChartProps extends PieProps {
    data: PieChartData[];
    colors?: string[];
}

const StyledPieChart = styled(PieChart)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const CustomPieChart = ({ data, colors, ...props }: CustomPieChartProps) => {
    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 4}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
            </g>
        );
    };

    return (
        <StyledPieChart width={400} height={400}>
            <Pie
                dataKey={'count'}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={150}
                fill="#8884d8"
                labelLine={true}
                label={(entry) => `${entry.payload?.kind}`}
                activeShape={renderActiveShape}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors?.[index % colors.length] ?? '#8884d8'} />
                ))}
            </Pie>
            <Legend
                formatter={(value, { payload }: any) => {
                    return `${payload?.kind} (${payload?.count})`;
                }}
            />

            <Tooltip formatter={(value, name, props) => [`${props.payload.kind} ${props.payload.count}`, '']} />
        </StyledPieChart>
    );
};

export default CustomPieChart;
