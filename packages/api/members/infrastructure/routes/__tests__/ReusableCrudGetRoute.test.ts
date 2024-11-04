import { ApiGatewayModelGenerator, Model } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ReusableCrudGetRoute } from '../ReusableCrudGetRoute';

describe('ReusableCrudGetRoute', () => {
  let apiGatewayModelGenerator: ApiGatewayModelGenerator;
  let agCrudGetModel: Model;
  let entityTableName: string;
  let entityName: string;
  let entityCollectionName: string;
  let pkPrefix: string;
  let skPrefix: string;
  let pkQueryKey: string;
  let skQueryKey: string;
  let modelName: string;
  let payloadTypeName: string;

  beforeEach(() => {
    apiGatewayModelGenerator = {} as ApiGatewayModelGenerator;
    agCrudGetModel = {} as Model;
    entityTableName = 'testTable';
    entityName = 'testEntity';
    entityCollectionName = 'testCollection';
    pkPrefix = 'PK#';
    skPrefix = 'SK#';
    pkQueryKey = 'pk';
    skQueryKey = 'sk';
    modelName = 'TestModel';
    payloadTypeName = 'TestPayload';
  });

  it('should correctly assign constructor parameters to class properties', () => {
    const route = new ReusableCrudGetRoute(
      apiGatewayModelGenerator,
      agCrudGetModel,
      entityTableName,
      entityName,
      entityCollectionName,
      pkPrefix,
      skPrefix,
      pkQueryKey,
      skQueryKey,
      modelName,
      payloadTypeName,
    );

    expect(route['apiGatewayModelGenerator']).toBe(apiGatewayModelGenerator);
    expect(route['agCrudGetModel']).toBe(agCrudGetModel);
    expect(route['entityTableName']).toBe(entityTableName);
    expect(route['entityName']).toBe(entityName);
    expect(route['entityCollectionName']).toBe(entityCollectionName);
    expect(route['pkPrefix']).toBe(pkPrefix);
    expect(route['skPrefix']).toBe(skPrefix);
    expect(route['pkQueryKey']).toBe(pkQueryKey);
    expect(route['skQueryKey']).toBe(skQueryKey);
    expect(route['modelName']).toBe(modelName);
    expect(route['payloadTypeName']).toBe(payloadTypeName);
  });
});
