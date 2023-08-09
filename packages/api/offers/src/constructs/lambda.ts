import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { TypeLambda } from "./lambdas/typeLambda";
import { Tables } from "./tables";
import { Stack } from "aws-cdk-lib";

/**
 * This class centeralisies the creation of the lambdas.
 * @param stack - The stack to add the lambdas to
 * @param tables - The tables to use in the lambdas
*/
export class Lambda {
    typeLambda: NodejsFunction;
    
    constructor(stack: Stack, tables: Tables) {
        const typeLambda = new TypeLambda(stack, tables);
        this.typeLambda = typeLambda.create();
    }

}