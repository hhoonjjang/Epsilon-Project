import { Document, Types } from 'mongoose';
import { IUser, IComment } from './index';

export enum BoardType {
    GENERAL = 'general',
    FREE = 'free',
    NOTICE = 'notice',
}

export default interface IBoard extends Document {
    title: string;
    text: string;
    writer: Types.ObjectId | IUser;
    createdAt: Date;
    updatedAt: Date;
    like: number;
    view: number;
    tag: string[];
    img: string[];
    comments: Types.ObjectId[] | IComment[];
    type: BoardType;
}
