import { Schema, Document, Types } from 'mongoose';

export default interface IComment extends Document {
    text: string;
    writer: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    like: number;
    img?: string;
    recomment: Types.ObjectId[];
}
