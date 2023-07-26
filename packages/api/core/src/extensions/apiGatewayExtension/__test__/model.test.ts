import { JsonSchemaType, JsonSchemaVersion, Model as ApiModel, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Model } from '../model';
import { Stack } from 'aws-cdk-lib';

jest.mock('aws-cdk-lib/aws-apigateway');

describe('Model', () => {
  let api: RestApi;
  let modelName: string;
  let modelDefinition: any;
  let model: Model;

  beforeEach(() => {
    const scope = new Stack();
    const id = 'MyApi';
    api = new RestApi(scope, id);
    modelName = 'TestModel';
    modelDefinition = {
      properties: {
        prop1: { type: 'string' },
        prop2: { type: 'number' },
      },
      required: ['prop1'],
    };
    model = new Model(api, modelName, modelDefinition);
  });

  test('constructor creates an ApiModel with the correct parameters', () => {
    expect(ApiModel).toHaveBeenCalledTimes(1);
    expect(ApiModel).toHaveBeenCalledWith(api, modelName, {
      restApi: api,
      contentType: 'application/json',
      modelName: modelName,
      schema: {
        schema: JsonSchemaVersion.DRAFT4,
        title: modelName,
        type: JsonSchemaType.OBJECT,
        properties: modelDefinition.properties,
        required: modelDefinition.required,
      },
    });
  });

  test('getModel returns the created ApiModel', () => {
    const returnedModel = model.getModel();
    expect(returnedModel).toBeInstanceOf(ApiModel);
  });
});
