import User from "~/server/models/user"
import setResponse from "~/server/utils/set-response"

export default defineEventHandler(async (event) => {
    try {
        const items = await User.find().sort('-createdAt')
        return setResponse(event, { statusCode: 200, statusMessage: 'success', data: items })
    } catch (error: unknown) {
        return setResponse(event, { statusCode: 500, statusMessage: 'Something went wrong.' })
    }
})