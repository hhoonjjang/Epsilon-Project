import { Document, Types } from 'mongoose';

export default interface IStake extends Document {
    expiredAt?: Number;
    stakeValueId: Types.ObjectId;
    createdAt: Date;
    reward: Number;
    amount: Number;
    blockTime: Number;
    account: String;
    tokenId: Number;
}
