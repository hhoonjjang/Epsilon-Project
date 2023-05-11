import { Document, Types } from 'mongoose';

export default interface IUser extends Document {
    name: string;
    profile: string;
    account: string;
    level: number;
    score: number;
    nfts: Types.ObjectId[];
    likeContents: { contentType: string; contentId: Types.ObjectId }[];
    boards: Types.ObjectId[];
    comments: Types.ObjectId[];
    blockList: Array<string>;
    searchHistory: Array<string>;
    createdAt: Date;
    updatedAt: Date;
    approve: Boolean;
}
