import { Stack } from 'sst/constructs';

export function getCognitoUserPoolIdStackOutputName(stack: Stack): string {
  return `${stack.stage}-CognitoUserPoolId`
}

export function getNewCognitoUserPoolIdStackOutputName(stack: Stack): string {
  return `${stack.stage}-CognitoUserPoolIdNew`
}
