import { StackContext, Api } from "sst/constructs";

export function Identity({ stack }: StackContext) {
  const api = new Api(stack, "identity", {
    routes: {
      "ANY /users": "packages/api/identity/src/user-management/lambda.handler",
      "ANY /eligibility":
        "packages/api/identity/src/eligibility/lambda.handler",
    },
  });

  stack.addOutputs({
    IdentityApiEndpoint: api.url,
  });
}
