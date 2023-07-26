import { Model } from '../model';
import { ResponseModel } from '../responseModel';
import { MethodResponses } from '../methodResponse';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Stack } from 'aws-cdk-lib';

describe('MethodResponses', () => {
  test('toMethodResponses transforms an array of ResponseModels correctly', () => {
    const stack = new Stack();
    const api = new RestApi(stack, 'TestApi');
    const mockModel = new Model(api, 'TestModel', {});

    mockModel.getModel = jest.fn().mockReturnValue({});

    const responses = [
      new ResponseModel('200', mockModel),
      new ResponseModel('400', mockModel),
      new ResponseModel('500', mockModel),
    ];

    const methodResponses = MethodResponses.toMethodResponses(responses);

    expect(methodResponses).toEqual([
      { statusCode: '200', responseModels: { 'application/json': {} } },
      { statusCode: '400', responseModels: { 'application/json': {} } },
      { statusCode: '500', responseModels: { 'application/json': {} } },
    ]);
  });
});
