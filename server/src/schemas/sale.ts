import mongoose, { Model, Schema, Types } from 'mongoose';
import { ISale } from '../interfaces';

const SaleSchema: Schema = new Schema({
    price: {
        type: Number,
        required: true,
    },
    nftId: {
        type: Types.ObjectId,
        required: true,
        ref: 'Nft', // 참조할 모델의 이름
    },
    amount: {
        type: Number,
        required: true,
    },
    seller: {
        type: Types.ObjectId,
        required: true,
        ref: 'User', // 참조할 모델의 이름
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
});

const Sale: Model<ISale> = mongoose.model<ISale>('Sale', SaleSchema);

export default Sale;
