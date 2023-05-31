import { StackContext, Api } from "sst/constructs";

export function Offers({ stack }: StackContext) {
  const api = new Api(stack, "offers", {
    routes: {
      "GET /": "packages/api/offers/src/lambda.handler",
    },
  });

  stack.addOutputs({
    OffersApiEndpoint: api.url,
  });
}
