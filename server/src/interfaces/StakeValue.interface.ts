import { Document, Types } from 'mongoose';

export default interface IStakeValue extends Document {
    average: number;
    price?: number;
    admin: string;
    amount: number[];
    nftId: Types.ObjectId;
    createdAt: Date;
    duration: number;
    tokenId: string;
    name: string;
}
