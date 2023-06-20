import { StackContext, NextjsSite, use } from "sst/constructs";
import { Identity } from "../../packages/api/identity/stack";
import { Offers } from "../../packages/api/offers/stack";

export function Web({ stack }: StackContext) {

    const { identityApi } = use(Identity);
    const { offersApi } = use(Offers);


    const site = new NextjsSite(stack, "Site", {
        path: "packages/web/",
        environment : {
            IDENTITY : identityApi.url,
            OFFERS: offersApi.url
        }
    });

    stack.addOutputs({
        URL: site.url,
    });
}
