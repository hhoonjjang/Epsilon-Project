import { Document, Types } from 'mongoose';

export default interface INft extends Document {
    tokenId: number;
    owners: { owner: Types.ObjectId; amount: number }[];
    name: string;
    desc: string;
    img: string;
    amount: number;
    kind: string;
    price: number;
    transactions: Types.ObjectId[];
    saleInfo: Types.ObjectId[];
    like: number;
    view: number;
    createdAt: Date;
    updatedAt: Date;
}
