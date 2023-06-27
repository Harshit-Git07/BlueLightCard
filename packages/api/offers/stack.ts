import { StackContext, Api } from "sst/constructs";

export function Offers({ stack }: StackContext) {
  const offersApi = new Api(stack, "offers", {
    routes: {
      "GET /": "packages/api/offers/src/offers/lambda.get",      
      "POST /": {
        function: "packages/api/offers/src/offers/lambda.post",
        
      }  
    }
  });

  stack.addOutputs({
    OffersApiEndpoint: offersApi.url,
  });

  return {
    offersApi: offersApi
  }
}
