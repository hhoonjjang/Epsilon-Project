import { Document } from 'mongoose';

export default interface ITransaction extends Document {
    amount: number;
    type: 'Sell' | 'Swap' | 'Claim' | 'Stake' | 'Transfer' | 'StakeBatch';
    status: 'Success' | 'Failed' | 'Pending';
    createdAt: Date;
    from: string;
    to: string;
    hash: string;
}
