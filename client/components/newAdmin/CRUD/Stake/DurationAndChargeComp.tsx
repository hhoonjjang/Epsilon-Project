import { Box, Grid, Paper } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

interface tokenBalance {
    duration: number;
    charge: number;
}

const DurationAndChargeComp = ({
    index,
    setCurDurationAndCharge,
    curDurationAndCharge,
}: {
    index: number;
    setCurDurationAndCharge: Dispatch<SetStateAction<tokenBalance[]>>;
    curDurationAndCharge: tokenBalance[];
}) => {
    const [duration, setDuration] = useState<number>(0);

    return (
        <Box sx={{ display: 'flex' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                }}
            >
                <Box>Duration</Box>
                <Box>Charge</Box>
            </Box>
            <Box>
                <Box>
                    <TextField
                        size="small"
                        id="outlined-basic"
                        label={`duration ${index}`}
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            let tempData = [...curDurationAndCharge];
                            tempData[index] = { duration: e.target.valueAsNumber, charge: tempData[index].charge };
                            if (!e.target.value) {
                                return;
                            } else setCurDurationAndCharge(tempData);
                        }}
                    />
                </Box>
                <Box>
                    <TextField
                        size="small"
                        id="outlined-basic"
                        label={`charge ${index}`}
                        variant="outlined"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            let tempData = [...curDurationAndCharge];
                            tempData[index] = { duration: tempData[index].duration, charge: e.target.valueAsNumber };
                            if (!e.target.value) {
                                return;
                            } else setCurDurationAndCharge(tempData);
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default DurationAndChargeComp;
