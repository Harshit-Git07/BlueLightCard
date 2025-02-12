import { ResponseModel } from './responseModel';
import { MethodResponse } from 'aws-cdk-lib/aws-apigateway/lib/methodresponse';

export class MethodResponses {
  static toMethodResponses(responses: ResponseModel[]): MethodResponse[] {
    return responses.map(response => ({
      statusCode: response.statusCode,
      responseModels: { 'application/json': response.responseModel.getModel() }
    }));
  }
}

