import mongoose, { Model, Schema, Types } from 'mongoose';
import { IStake } from '../interfaces';

const StakeSchema: Schema = new Schema({
    expiredAt: {
        type: Number,
    },
    stakeValueId: {
        type: Types.ObjectId,
        ref: 'StakeValue',
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(Date.now() + 9 * 60 * 60 * 1000),
    },
    reward: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    blockTime: {
        type: Number,
    },
    account: {
        type: String,
    },
    tokenId: {
        type: Number,
    },
});

const Stake: Model<IStake> = mongoose.model<IStake>('Stake', StakeSchema);

export default Stake;
