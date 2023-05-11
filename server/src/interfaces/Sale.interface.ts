import { Document, Types } from 'mongoose';

export default interface ISale extends Document {
    price: number;
    nftId: Types.ObjectId;
    amount: number;
    seller: Types.ObjectId;
    start: Date;
    end: Date;
}
