import { ApiHandler } from "sst/node/api";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const get = ApiHandler(async (_evt) => {
  return {
    body: `GET: Hello world. The time is`,
  };
});

export const post = ApiHandler(async (_evt) => {
  return {
    body: `POST: Hello world. The time is ${JSON.parse(_evt.body)}`,
  };
});