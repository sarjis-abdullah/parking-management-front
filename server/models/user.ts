import mongoose from "mongoose"
import { Types } from "mongoose"

export interface IUser {
    _id: Types.ObjectId
    name: string,
    email: string,
    phone: string,
    hasComplimentaryCard: boolean,
    phoneVerified: boolean,
    occupation: string,
    familyMembers: string,
    gender: string,
    address: string,
    birthDate: Date,
    anniversary: Date,
    createdAt: Date,
    updatedAt: Date
}
const schema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'name field is required.'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'address field is required.'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Mobile number field is required.'],
        trim: true
    },
    birthDate: {
        type: Date,
        required: [true, 'Birthdate field is required.'],
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true
    },
    occupation: {
        type: String,
        required: false,
        trim: true
    },
    familyMembers: {
        type: String,
        required: false,
        trim: true
    },
    gender: {
        type: String,
        required: false,
        trim: true
    },
    anniversary: {
        type: Date,
        required: false,
        trim: true
    },
    hasComplimentaryCard: {
        type: Boolean,
        required: false,
        default: false
    },
    phoneVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default mongoose.model<IUser>('User', schema)