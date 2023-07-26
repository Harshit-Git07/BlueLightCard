import { JsonSchemaType, JsonSchemaVersion, Model as ApiModel, RestApi } from 'aws-cdk-lib/aws-apigateway';

export class Model {
  private model: ApiModel;

  constructor(api: RestApi, modelName: string, modelDefinition: any) {
    const modelSchema = {
      schema: JsonSchemaVersion.DRAFT4,
      title: modelName,
      type: JsonSchemaType.OBJECT,
      properties: modelDefinition.properties,
      required: modelDefinition.required,
    };
    this.model = new ApiModel(api, modelName, {
      restApi: api,
      contentType: 'application/json',
      modelName: modelName,
      schema: modelSchema,
    });
  }

  getModel(): ApiModel {
    return this.model;
  }
}
