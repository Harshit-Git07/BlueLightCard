import { ResponseModel } from '../responseModel';
import { Model } from '../model';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Stack } from 'aws-cdk-lib';

jest.mock('../model');
jest.mock('aws-cdk-lib/aws-apigateway');

describe('ResponseModel', () => {
  test('constructor sets the correct properties', () => {
    const api = new RestApi(new Stack(), 'MyApi');
    const model = new Model(api, 'TestModel', {});
    const statusCode = '200';

    const responseModel = new ResponseModel(statusCode, model);

    expect(responseModel).toHaveProperty('statusCode', statusCode);
    expect(responseModel).toHaveProperty('responseModel', model);
  });
});
