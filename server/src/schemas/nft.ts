import mongoose, { Model, Schema, Types } from 'mongoose';
import { INft } from '../interfaces';

const NftSchema: Schema = new Schema({
    tokenId: {
        type: Number,
        required: true,
    },
    owners: [
        {
            owner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            amount: {
                type: Number,
            },
        },
    ],
    name: {
        type: String,
    },
    desc: {
        type: String,
    },
    img: {
        type: String,
    },
    amount: {
        type: Number,
    },
    kind: {
        type: String,
    },
    price: {
        type: Number,
        default: 0,
    },
    transactions: [
        {
            type: Types.ObjectId,
            ref: 'Transaction',
        },
    ],
    saleInfo: [
        {
            type: Types.ObjectId,
            ref: 'Sale',
        },
    ],
    like: {
        type: Number,
        default: 0,
    },
    view: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: new Date(Date.now() + 9 * 60 * 60 * 1000),
    },
    updatedAt: {
        type: Date,
        default: new Date(Date.now() + 9 * 60 * 60 * 1000),
    },
});

const Nft: Model<INft> = mongoose.model<INft>('Nft', NftSchema);

export default Nft;
