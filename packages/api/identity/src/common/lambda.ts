import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Tables} from '../eligibility/constructs/tables';
import {Stack} from 'aws-cdk-lib';
import {Buckets} from '../eligibility/constructs/buckets';
import {EcFormOutrputDataLambda} from "../eligibility/constructs/lambdas/ecFormOutrputDataLambda";
import {CustomAuthenticatorLambda} from '../authenticator/lambdas/constructs/customAuthenticatorLambda';

/**
 * This class centralises the creation of the lambdas.
 * @param stack - The stack to add the lambdas to
 * @param tables - The tables to use in the lambdas
 */
export class Lambda {
    ecFormOutrputDataLambda: NodejsFunction;
    customAuthenticatorLambda: NodejsFunction;

    constructor(private stack: Stack,
                private tables: Tables,
                private buckets: Buckets,
				private stage: String) {
        this.ecFormOutrputDataLambda = new EcFormOutrputDataLambda(this.stack, this.tables, this.buckets, this.stage).create();
        this.customAuthenticatorLambda = new CustomAuthenticatorLambda(this.stack, this.stage).create();
    }
}
