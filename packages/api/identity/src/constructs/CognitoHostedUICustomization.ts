import { Stack } from 'aws-cdk-lib';
import { IUserPool, IUserPoolClient } from 'aws-cdk-lib/aws-cognito';

import { BRANDS } from '@blc-mono/core/types/brands.enum';
import { CognitoUICustomizationAttachment } from './CognitoUICustomizationAttachment';

/**
 *  This class creates all the tables for the Offers API
 *  @param stack - The stack to add the tables to
 */
export class CognitoHostedUICustomization {
  constructor(
    private stack: Stack,
    private brand: string,
    private region: string,
    private userPool: IUserPool,
    private appClients: IUserPoolClient[],
    private cssPath: string,
    private logoPath: string,
  ) {
    this.customizeHostedUI();
  }

  private customizeHostedUI() {
    for (const client of this.appClients) {
      new CognitoUICustomizationAttachment(this.stack, `${this.brand}-${this.region}-CognitoUICustomizationAttachment-${client.node.id}`, {
        userPool: this.userPool,
        userPoolClient: client,
        cssPath: this.cssPath,
        logoPath: this.logoPath,
      });
    }
  }
}
