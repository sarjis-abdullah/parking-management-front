import { Error } from "mongoose"
import User from "~/server/models/user"
import OTP, { OTPInterface } from "~/server/models/otp"
import { IUser } from "~/server/models/user"
import setResponse from "~/server/utils/set-response"

const getErrors = (err: any, event)=> {
    if (err) {
        if (err?.errors) {
            const validationErrors: any = {};
            for (const field in err.errors) {
                validationErrors[field] = err.errors[field].message;
            }
            return setResponse(event, {statusCode: 400, statusMessage: validationErrors})
        } else {
            if (err instanceof Error.ValidationError) {
                return setResponse(event, { statusCode: 400, statusMessage: (err.message) })
            }
        }
    }
    return setResponse(event, { statusCode: 500, statusMessage: 'Something went wrong', cause: err })
}
export default defineEventHandler(async (event) => {
    try {
        const body: OTPInterface = await readBody(event)
        if (!body.userId || !body.code) {
            return setResponse(event, { statusCode: 400, statusMessage: 'Bad request.' })
        }
        const item = await OTP.findOne<OTPInterface>({ userId: body.userId, code: body.code })
                                                                         
        if (item != null || item != undefined) {
            await User.findByIdAndUpdate<IUser>({ _id: body.userId }, { phoneVerified: true })
        return setResponse(event, { statusCode: 200, statusMessage: 'Item is updated.' })
        }
        
        return setResponse(event, { statusCode: 404, statusMessage: 'Not found.' })
    } catch (err: unknown) {
        return getErrors(err, event)
    }
})