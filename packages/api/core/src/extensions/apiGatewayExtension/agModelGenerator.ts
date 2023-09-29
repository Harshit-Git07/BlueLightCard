import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Model, BadRequestModelSchema, GenericResponseSchema, ResponseModel } from './';

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema'

export class ApiGatewayModelGenerator {
  private model?: Model;
  private genericModel: Model;
  private badRequestModel: Model;

  constructor(private api: RestApi) {
     this.genericModel = new Model(this.api, "GenericModel", GenericResponseSchema);
     this.badRequestModel = new Model(this.api, "BadRequestModel", BadRequestModelSchema);
  }

  generateModel(model: z.ZodObject<any>): Model {
    const _modelName = (model as any)._ModelName;
    const modelSchema = zodToJsonSchema(model, _modelName);
    const modelDefinition = modelSchema.definitions?.[_modelName];
    if (!this.model) {
      this.model = new Model(this.api, _modelName, modelDefinition);
    }
    return this.model;
  }

  generateModelFromZodEffect(model: z.ZodEffects<any>): Model {
    const _modelName = (model as any)._ModelName;
    const modelSchema = zodToJsonSchema(model, _modelName);
    const modelDefinition = modelSchema.definitions?.[_modelName];
    if (!this.model) {
      this.model = new Model(this.api, _modelName, modelDefinition);
    }
    return this.model;
  }

  generateGenericModel() {
    return this.genericModel;
  }

  private makeErrorResponseModel(statusCode: string) {
    return new ResponseModel(statusCode, this.genericModel);
  }

  getError400() {
    return new ResponseModel('400', this.badRequestModel);
  }

  getError401() {
    return this.makeErrorResponseModel('401')
  }

  getError403() {
    return this.makeErrorResponseModel('403')
  }

  getError404() {
   return this.makeErrorResponseModel('404')
  }

  getError500() {
    return this.makeErrorResponseModel('500')
  }

  getError502() {
    return this.makeErrorResponseModel('502')
  }

  getDefault4xxErrors() {
    return [this.getError401(), this.getError403(), this.getError404()]
  }

  getDefault5xxErrors() {
    return [this.getError500(), this.getError502()]
  }
}

