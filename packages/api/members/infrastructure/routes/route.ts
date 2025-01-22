import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayV1ApiFunctionRouteProps, Function as SstFunction, Stack } from 'sst/constructs';
import { SSTConstruct } from 'sst/constructs/Construct';
import { Permissions } from 'sst/constructs/util/permission';
import {
  ApiGatewayModelGenerator,
  MethodResponses,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';

import { MemberStackEnvironmentKeys } from '../constants/environment';
import { NamedZodType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';
import { IVpc } from 'aws-cdk-lib/aws-ec2';

type CreateRouteResult = ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>;

export type RouteProps<Request extends z.AnyZodObject, Response extends z.AnyZodObject> = {
  stack: Stack;
  name: string;
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  environment?: Partial<Record<keyof typeof MemberStackEnvironmentKeys, string>>;
  handler?: string;
  handlerFunction?: SstFunction;
  requestValidator: RequestValidator;
  requestModelType?: NamedZodType<Request>;
  responseModelType?: NamedZodType<Response>;
  bind?: SSTConstruct[];
  defaultAllowedOrigins: string[];
  permissions?: Permissions;
  apiKeyRequired?: boolean;
  vpc?: IVpc;
  authorizer?: CreateRouteResult['authorizer'];
};

export type DefaultRouteProps = Pick<
  RouteProps<never, never>,
  | 'stack'
  | 'apiGatewayModelGenerator'
  | 'requestValidator'
  | 'bind'
  | 'defaultAllowedOrigins'
  | 'environment'
  | 'authorizer'
  | 'name'
  | 'permissions'
  | 'vpc'
>;

export class Route {
  public static createRoute<Request extends z.AnyZodObject, Response extends z.AnyZodObject>({
    stack,
    name,
    apiGatewayModelGenerator,
    environment,
    handler,
    handlerFunction,
    requestValidator,
    requestModelType,
    responseModelType,
    bind,
    defaultAllowedOrigins,
    permissions,
    apiKeyRequired,
    vpc,
    // TODO: Add authorizor only for member profile endpoint as it's causing some testing issues
    authorizer,
  }: RouteProps<Request, Response>): ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'> {
    let requestModels;
    if (requestModelType) {
      if (Route.requestModelsEnabled()) {
        const requestModel = apiGatewayModelGenerator.generateModel(requestModelType);
        requestModels = { 'application/json': requestModel.getModel() };
      }
    }

    let methodResponses;
    if (responseModelType) {
      const commonErrorResponseModels = [
        apiGatewayModelGenerator.getError400(),
        apiGatewayModelGenerator.getError401(),
        apiGatewayModelGenerator.getError403(),
        apiGatewayModelGenerator.getError404(),
        apiGatewayModelGenerator.getError500(),
      ];
      if (Route.responseModelsEnabled()) {
        const responseModel = apiGatewayModelGenerator.generateModel(responseModelType);
        methodResponses = MethodResponses.toMethodResponses(
          [
            new ResponseModel('200', responseModel),
            new ResponseModel('201', apiGatewayModelGenerator.generateGenericModel()),
            new ResponseModel('204', apiGatewayModelGenerator.generateGenericModel()),
            ...commonErrorResponseModels,
          ].filter(Boolean),
        );
      } else {
        methodResponses = MethodResponses.toMethodResponses(
          [...commonErrorResponseModels].filter(Boolean),
        );
      }
    }

    return {
      authorizer,
      cdk: {
        function:
          handlerFunction ??
          new SstFunction(stack, `${name}Function`, {
            bind: bind,
            permissions,
            handler,
            environment: {
              [MemberStackEnvironmentKeys.SERVICE]: 'members',
              ...environment,
              [MemberStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS]:
                JSON.stringify(defaultAllowedOrigins),
            },
            vpc,
          }),
        method: {
          apiKeyRequired: apiKeyRequired,
          requestModels,
          methodResponses,
          requestValidator,
        },
      },
    };
  }

  private static responseModelsEnabled(): boolean {
    return process.env.RESPONSE_MODELS_ENABLED === 'true';
  }

  private static requestModelsEnabled(): boolean {
    return process.env.REQUEST_MODELS_ENABLED === 'true';
  }
}
