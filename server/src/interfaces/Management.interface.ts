import { Document, Types } from 'mongoose';

// 여기 내용 수정하기
export default interface IManagement extends Document {
    durationAndCharge: { duration: number; charge: number }[];
    swapFeeRate: number;
    swapSlippage: number;
    tokenWarning: string;
    slippageWarning: string;
}
