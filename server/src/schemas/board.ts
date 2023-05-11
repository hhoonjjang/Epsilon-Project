import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import { IBoard, BoardType } from '../interfaces';

const BoardSchema: Schema = new Schema<IBoard>({
    title: {
        type: String,
        required: true,
    },
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
    view: {
        type: Number,
        default: 0,
    },
    tag: {
        type: [String],
        default: [],
    },
    img: {
        type: [String],
        default: [],
    },
    comments: [
        {
            type: Types.ObjectId,
            ref: 'Comment',
            default: [],
        },
    ],
    type: {
        type: String,
        enum: Object.values(BoardType),
        default: BoardType.GENERAL,
    },
});

const Board: Model<IBoard> = mongoose.model<IBoard>('Board', BoardSchema);

export default Board;
