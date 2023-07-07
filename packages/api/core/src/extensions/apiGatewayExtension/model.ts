import { JsonSchemaType, JsonSchemaVersion, Model as ApiModel } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayV1Api } from 'sst/constructs';

export class Model {
  private model: ApiModel;

  constructor(api: ApiGatewayV1Api, modelName: string, modelDefinition: any) {
    const modelSchema = {
      schema: JsonSchemaVersion.DRAFT4,
      title: modelName,
      type: JsonSchemaType.OBJECT,
      properties: modelDefinition.properties,
      required: modelDefinition.required,
    };
    //  console.log(modelSchema)
    this.model = new ApiModel(api, modelName, {
      restApi: api.cdk.restApi,
      contentType: 'application/json',
      modelName: modelName,
      schema: modelSchema,
    });
  }

  getModel(): ApiModel {
    //console.log(this.model);
    return this.model;
  }
}
