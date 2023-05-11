import mongoose, { Model, Schema } from 'mongoose';
import { IManagement } from '../interfaces';

const ManagementSchema: Schema = new Schema({
    durationAndCharge: {
        type: [
            {
                duration: { type: Number },
                charge: { type: Number },
            },
        ],
        default: [
            { duration: 3, charge: 3 },
            { duration: 6, charge: 6 },
            { duration: 12, charge: 12 },
        ],
    },
    swapFeeRate: {
        type: Number,
    },
    swapSlippage: {
        type: Number,
    },
    tokenWarning: {
        type: String,
    },
    slippageWarning: {
        type: String,
    },
});

const Management: Model<IManagement> = mongoose.model<IManagement>('Management', ManagementSchema);

export default Management;
