import { useState } from 'react';
import { BarChart, Bar, Cell, Legend, Tooltip, Text, XAxis, YAxis, CartesianGrid, BarProps } from 'recharts';
import { styled } from '@mui/material/styles';
import { roundNumber } from '@/module/tools';
import { AxisDomain } from 'recharts/types/util/types';

interface BarChartData {
    type: string;
    count: number;
}

interface CustomBarChartProps {
    data: BarChartData[];
    colors?: string[];
    dataKey?: string;
    height?: number;
    width?: number;
}

const StyledBarChart = styled(BarChart)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .recharts-surface': {
        overflow: 'visible',
    },
});

const getPath = (x: number, y: number, width: number, height: number) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${
        x + width / 2
    }, ${y} C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height} Z`;
};

const TriangleBar = (props: any) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x as number, y as number, width as number, height as number)} stroke="none" fill={fill} />;
};

const CustomBarChart = ({ width, height, data, colors, dataKey, ...props }: any) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleMouseOver = (data: any, index: number) => {
        setActiveIndex(index);
    };

    const handleMouseOut = () => {
        setActiveIndex(null);
    };

    return (
        <>
            <StyledBarChart width={width || 400} height={height || 200} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type"></XAxis>
                <YAxis dataKey={'count'}></YAxis>
                <Bar
                    dataKey={'count'}
                    fill="#8884d8"
                    label={<CustomLabel data={data} />}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    shape={<TriangleBar height={height} />}
                >
                    {data.map((entry: any, index: any) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={activeIndex === index ? '#ff7300' : colors?.[index % colors.length] ?? '#8884d8'}
                        />
                    ))}
                </Bar>

                <Tooltip
                    formatter={(value, name, props) => {
                        return [`${props.payload.type} ${roundNumber(+value, 2)}`, ''];
                    }}
                />
            </StyledBarChart>
        </>
    );
};

const CustomLabel = (props: any) => {
    const { x, y, width, value, data, index, height } = props;
    return (
        <Text x={x + width / 2} y={y + height * 0.01} fill="var(--darkgrey)" textAnchor="middle" dy={-6}>
            {`${value}`}
        </Text>
    );
};

export default CustomBarChart;
