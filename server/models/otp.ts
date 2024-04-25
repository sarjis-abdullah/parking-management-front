import mongoose from "mongoose"
import { Types } from "mongoose"

export interface OTPInterface {
    _id: Types.ObjectId
    type: string, //phone/email
    code: string,
    userId: string,
    expireAt: Date,
    createdAt: Date,
    updatedAt: Date
}
const schema = new mongoose.Schema<OTPInterface>({
    userId: {
        type: String,
        required: [true, 'userId field is required.'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'type field is required.'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'code field is required.'],
        trim: true
    },
    expireAt: {
        type: Date,
        required: true,
        trim: true
    },
}, { timestamps: true })

export default mongoose.model<OTPInterface>('OTP', schema)