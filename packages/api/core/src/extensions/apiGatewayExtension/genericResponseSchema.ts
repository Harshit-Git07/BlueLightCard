import { JsonSchemaType } from 'aws-cdk-lib/aws-apigateway';

export const GenericResponseSchema = {
  properties: {
    message: { type: JsonSchemaType.STRING },
  },
  required: ['message'],
};
