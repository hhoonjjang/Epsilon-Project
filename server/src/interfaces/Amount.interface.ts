import { Document } from 'mongoose';

export default interface IAmount extends Document {
    amount: number;
    createdAt: Date;
}
