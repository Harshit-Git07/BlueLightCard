import { APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { ReusableCrudQueryPayload } from '../../types/reusableCrudQueryPayload';

export class ReusableCrudQueryMapper {
  static fromPathParameters(
    pathParameters: APIGatewayProxyEventPathParameters | null,
    pkKey: string,
    skKey: string,
  ): ReusableCrudQueryPayload {
    if (!pathParameters) {
      throw new Error('Event path parameters are required');
    }
    if (!pathParameters[pkKey]) {
      throw new Error(`${pkKey} is required`);
    }
    return {
      pk: pathParameters[pkKey]!,
      sk: pathParameters[skKey] || null,
    };
  }
}
