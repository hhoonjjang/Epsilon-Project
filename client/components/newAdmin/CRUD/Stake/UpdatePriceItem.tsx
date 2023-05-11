import { Box, Grid, Paper } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import axios from 'axios';

const UpdatePriceItem = ({
    name,
    price,
    setIsListUpdate,
    id,
    handleClick,
}: {
    name: string;
    price: number;
    setIsListUpdate: Dispatch<SetStateAction<boolean>>;
    id: string;
    handleClick: (type: string) => void;
}) => {
    const [inputAmount, setInputAmount] = useState<number>(0);

    const updateStakePriceFunc = async () => {
        if (!inputAmount) return;
        try {
            const updateStakePrice = await axios.post('http://13.125.251.97:8080/api/admin/updateStakePrice', {
                id: id,
                price: inputAmount,
            });
            console.log(updateStakePrice);
            setIsListUpdate((state) => !state);
            handleClick('success');
            return updateStakePrice;
        } catch (error) {
            console.error(error);
            handleClick('error');
            return error;
        }
    };

    useEffect(() => {
        console.log(inputAmount);
    }, [inputAmount]);

    return (
        <>
            <Box>
                <TextField
                    sx={{ right: 0 }}
                    id="standard-search"
                    label={`${name} : ${price} HUT`}
                    variant="standard"
                    type="number"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        console.log(e.target.value);
                        setInputAmount(+e.target.value);
                    }}
                />
            </Box>
            <Box>
                <Button
                    sx={{ height: '40px' }}
                    variant="contained"
                    onClick={() => {
                        updateStakePriceFunc();
                    }}
                >
                    update
                </Button>
            </Box>
        </>
    );
};

export default UpdatePriceItem;
