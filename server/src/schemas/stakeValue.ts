import mongoose, { Model, Schema, Types } from 'mongoose';
import { IStakeValue } from '../interfaces';

const StakeValueSchema = new Schema({
    average: {
        type: Number,
        required: true,
        default: 0,
    },
    price: {
        type: Number,
        default: 0,
    },
    admin: {
        type: String,
        required: true,
        dafault: 'test-admin',
    },
    amount: {
        type: [Number],
        required: true,
        default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    nftId: {
        type: Types.ObjectId,
        ref: 'Nft',
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(Date.now() + 9 * 60 * 60 * 1000),
    },
    duration: {
        type: Number,
        required: true,
        default: 12,
    },
    tokenId: {
        type: String,
    },
    name: {
        type: String,
    },
});

const StakeValue: Model<IStakeValue> = mongoose.model<IStakeValue>('StakeValue', StakeValueSchema);

export default StakeValue;
