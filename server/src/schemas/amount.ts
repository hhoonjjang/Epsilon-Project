import mongoose, { Model, Schema } from 'mongoose';
import { IAmount } from '../interfaces';

const AmountSchema: Schema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(Date.now() + 9 * 60 * 60 * 1000),
    },
});

const Amount: Model<IAmount> = mongoose.model<IAmount>('Amount', AmountSchema);

export default Amount;
