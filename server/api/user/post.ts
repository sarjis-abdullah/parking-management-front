import { Error } from "mongoose";
import User, { IUser } from "~/server/models/user";
import OTP from "~/server/models/otp";
import setResponse from "~/server/utils/set-response";
import messagingApi from '@cmdotcom/text-sdk';


async function sendSMS(code: any, phone: any, event) {
const yourProductToken = "560b3d2c-3dff-4b0e-b474-bf40ecbad7b8";
const myMessageApi = new messagingApi.MessageApiClient(yourProductToken);

const result = myMessageApi.sendTextMessage(["01521487616"], "TestSender", "Hello world?!");

result.then((result) => {
    setResponse(event, {
        statusCode: 200,
        statusMessage: "Success",
        data: result,
      });
}).catch((error) => {
    setResponse(event, {
        statusCode: 500,
        statusMessage: "Something went wrong",
        cause: error,
      });
});
}

const getErrors = (err: any, event) => {
  if (err) {
    if (err?.errors) {
      const validationErrors: any = {};
      for (const field in err.errors) {
        validationErrors[field] = err.errors[field].message;
      }
      return setResponse(event, {
        statusCode: 400,
        statusMessage: validationErrors,
      });
    } else {
      if (err instanceof Error.ValidationError) {
        return setResponse(event, {
          statusCode: 400,
          statusMessage: err.message,
        });
      }
    }
  }
  return setResponse(event, {
    statusCode: 500,
    statusMessage: "Something went wrong",
    cause: err,
  });
};

export default defineEventHandler(async (event) => {
  try {
    const body: IUser = await readBody(event);
    if (!body) {
      return setResponse(event, {
        statusCode: 400,
        statusMessage: "Item field is required.",
      });
    }

    const item = await User.create(body);
    const digits = "0123456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += digits[Math.floor(Math.random() * 10)];
    }
    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + 1);
    await OTP.create({
      code: 1234,
      expireAt: expireAt,
      type: "phone",
      userId: item._id,
    });
    sendSMS(code, item.phone, event)
    return setResponse(event, {
      statusCode: 200,
      statusMessage: "success",
      data: item,
    });
  } catch (err: unknown) {
    return getErrors(err, event);
  }
});
