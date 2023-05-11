import mongoose, { Schema, Types, Model } from 'mongoose';
import { IComment } from '../interfaces';

const CommentSchema: Schema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        writer: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },
        createdAt: {
            type: Date,
            default: new Date(Date.now() + 9 * 60 * 60 * 1000),
        },
        updatedAt: {
            type: Date,
            default: new Date(Date.now() + 9 * 60 * 60 * 1000),
        },
        like: {
            type: Number,
            default: 0,
        },
        img: {
            type: String,
        },
        recomment: [
            {
                type: Types.ObjectId,
                ref: 'Comment',
            },
        ],
    },
    {
        versionKey: false,
    }
);

const Comment: Model<IComment> = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
