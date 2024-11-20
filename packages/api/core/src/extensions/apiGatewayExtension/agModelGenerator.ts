import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Model, BadRequestModelSchema, GenericResponseSchema, ResponseModel } from './';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export type NamedZodType<T extends z.ZodTypeAny> = T & { readonly _ModelName: string };
export function createZodNamedType<T extends z.ZodTypeAny>(name: string, type: T): NamedZodType<T> {
  const obj = type as NamedZodType<T>;
  // @ts-expect-error
  obj._ModelName = name;
  return obj;
}

export class ApiGatewayModelGenerator {
  private genericModel: Model;
  private badRequestModel: Model;
  private modelCache: Record<string, Model> = {};

  constructor(private api: RestApi) {
    this.genericModel = new Model(this.api, "GenericModel", GenericResponseSchema);
    this.badRequestModel = new Model(this.api, "BadRequestModel", BadRequestModelSchema);
  }

  generateModel<T extends z.AnyZodObject>(model: NamedZodType<T>): Model {
    return this.getModelFromCache(model);
  }

  generateModelFromZodEffect<T extends z.ZodEffects<any>>(model: NamedZodType<T>): Model {
    return this.getModelFromCache(model);
  }

  private getModelFromCache<T extends (z.AnyZodObject | z.ZodEffects<any>)>(model: NamedZodType<T>): Model {
    const modelName = (model as any)._ModelName;
    const modelSchema = zodToJsonSchema(model, modelName);
    const modelDefinition = modelSchema.definitions?.[modelName];

    let apiModel = this.modelCache[modelName];
    if (!apiModel) {
      apiModel = new Model(this.api, modelName, modelDefinition);
      this.modelCache[modelName] = apiModel;
    }
    return apiModel;
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

