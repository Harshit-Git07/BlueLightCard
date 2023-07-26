import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayModelGenerator, Model, BadRequestModelSchema, GenericResponseSchema, ResponseModel } from './..';
import { Stack } from 'aws-cdk-lib';
import { z } from 'zod';

jest.mock('aws-cdk-lib/aws-apigateway');
jest.mock('../model');

describe('ApiGatewayModelGenerator', () => {
  let api: RestApi;
  let generator: ApiGatewayModelGenerator;

  beforeEach(() => {
    const scope = new Stack();
    const id = 'MyApi';
    api = new RestApi(scope, id);
    generator = new ApiGatewayModelGenerator(api);
  });

  test('constructor creates Models with the correct parameters', () => {
    expect(Model).toHaveBeenCalledTimes(2);
    expect(Model).toHaveBeenCalledWith(api, 'GenericModel', GenericResponseSchema);
    expect(Model).toHaveBeenCalledWith(api, 'BadRequestModel', BadRequestModelSchema);
  });

  test('generateModel creates a new Model if it does not exist', () => {
    const model = z.object({
      prop1: z.string(),
      prop2: z.number(),
    });
    (model as any)._ModelName = 'TestModel';

    const returnedModel = generator.generateModel(model);

    expect(returnedModel).toBeInstanceOf(Model);
  });

  test('generateGenericModel returns the genericModel', () => {
    const returnedModel = generator.generateGenericModel();
    expect(returnedModel).toBeInstanceOf(Model);
  });

  test('getError400 returns a ResponseModel with status code 400', () => {
    const error = generator.getError400();
    expect(error).toBeInstanceOf(ResponseModel);
    expect(error.statusCode).toBe('400');
  });

  test('getError401 returns a ResponseModel with status code 401', () => {
    const error = generator.getError401();
    expect(error).toBeInstanceOf(ResponseModel);
    expect(error.statusCode).toBe('401');
  });

  test('getError403 returns a ResponseModel with status code 403', () => {
    const error = generator.getError403();
    expect(error).toBeInstanceOf(ResponseModel);
    expect(error.statusCode).toBe('403');
  });

  test('getError404 returns a ResponseModel with status code 404', () => {
    const error = generator.getError404();
    expect(error).toBeInstanceOf(ResponseModel);
    expect(error.statusCode).toBe('404');
  });

  test('getError500 returns a ResponseModel with status code 500', () => {
    const error = generator.getError500();
    expect(error).toBeInstanceOf(ResponseModel);
    expect(error.statusCode).toBe('500');
  });

  test('getError502 returns a ResponseModel with status code 502', () => {
    const error = generator.getError502();
    expect(error).toBeInstanceOf(ResponseModel);
    expect(error.statusCode).toBe('502');
  });

  test('getDefault4xxErrors returns an array of ResponseModels with 4xx status codes', () => {
    const errors = generator.getDefault4xxErrors();
    expect(errors).toHaveLength(3);
    errors.forEach((error: { statusCode: any; }) => {
      expect(error).toBeInstanceOf(ResponseModel);
      expect(['401', '403', '404']).toContain(error.statusCode);
    });
  });

  test('getDefault5xxErrors returns an array of ResponseModels with 5xx status codes', () => {
    const errors = generator.getDefault5xxErrors();
    expect(errors).toHaveLength(2);
    errors.forEach((error: { statusCode: any; }) => {
      expect(error).toBeInstanceOf(ResponseModel);
      expect(['500', '502']).toContain(error.statusCode);
    });
  });
});
