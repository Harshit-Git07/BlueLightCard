import { JsonSchemaType, JsonSchemaVersion, Model as ApiModel, RestApi, JsonSchema } from 'aws-cdk-lib/aws-apigateway';

export class Model {
  private jsonModel: ApiModel;

  constructor(restApi: RestApi, modelName: string, modelDefinition: any) {
    const schema: JsonSchema = {
      schema: JsonSchemaVersion.DRAFT4,
      title: modelName,
      type: JsonSchemaType.OBJECT,
      properties: modelDefinition.properties,
      required: modelDefinition.required,
    };
    this.jsonModel = new ApiModel(restApi, modelName, {
      restApi,
      modelName,
      schema,
      contentType: 'application/json',
    });
  }

  getModel(): ApiModel {
    return this.jsonModel;
  }
}
