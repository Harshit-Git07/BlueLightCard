import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Tables} from './tables';
import {Stack} from 'aws-cdk-lib';
import {Buckets} from './buckets';
import {EcFormOutrputDataLambda} from "./lambdas/ecFormOutrputDataLambda";

/**
 * This class centralises the creation of the lambdas.
 * @param stack - The stack to add the lambdas to
 * @param tables - The tables to use in the lambdas
 */
export class Lambda {
    ecFormOutrputDataLambda: NodejsFunction;

    constructor(private stack: Stack,
                private tables: Tables,
                private buckets: Buckets,
				private stage: String) {
        this.ecFormOutrputDataLambda = new EcFormOutrputDataLambda(this.stack, this.tables, this.buckets, this.stage).create();
    }
}
