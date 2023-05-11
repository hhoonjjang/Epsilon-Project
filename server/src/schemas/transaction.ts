import mongoose, { Model, Schema } from 'mongoose';
import { ITransaction } from '../interfaces';

export const TransactionSchema: Schema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['Sell', 'Swap', 'Claim', 'Stake', 'Transfer', 'Token', 'Unstake', 'StakeBatch', 'ClaimBatch'],
    },
    status: {
        type: String,
        required: true,
        enum: ['Success', 'Failed', 'Pending'],
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(Date.now() + 9 * 60 * 60 * 1000),
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
});
const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
