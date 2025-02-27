import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayV1ApiFunctionRouteProps, Function as SstFunction, Stack } from 'sst/constructs';
import { SSTConstruct } from 'sst/constructs/Construct';
import { Permissions } from 'sst/constructs/util/permission';
import {
  ApiGatewayModelGenerator,
  MethodResponses,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';

import { z } from 'zod';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { NamedZodType } from '@blc-mono/shared/utils/zodNamedType';
import { MethodOptions } from 'aws-cdk-lib/aws-apigateway/lib/method';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

export interface RouteProps<Request extends z.AnyZodObject, Response extends z.AnyZodObject> {
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
}

type CreateRouteResult = ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>;

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

export function createRoute<Request extends z.AnyZodObject, Response extends z.AnyZodObject>(
  props: RouteProps<Request, Response>,
): ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'> {
  const {
    requestModelType,
    responseModelType,
    apiGatewayModelGenerator,
    apiKeyRequired,
    requestValidator,
    // TODO: Add authorizor only for member profile endpoint as it's causing some testing issues
    authorizer,
  } = props;

  const requestModels = buildRequestModels(requestModelType, apiGatewayModelGenerator);
  const methodResponses = buildMethodResponses(responseModelType, apiGatewayModelGenerator);
  const lambdaFunction = buildFunction(props);

  return {
    authorizer,
    cdk: {
      function: lambdaFunction,
      method: {
        apiKeyRequired,
        requestModels,
        methodResponses,
        requestValidator,
      },
    },
  };
}

function buildRequestModels<Request extends z.AnyZodObject>(
  requestModelType: NamedZodType<Request> | undefined,
  apiGatewayModelGenerator: ApiGatewayModelGenerator,
): MethodOptions['requestModels'] {
  if (!requestModelType || !requestModelsEnabled()) return undefined;

  const requestModel = apiGatewayModelGenerator.generateModel(requestModelType);
  return {
    'application/json': requestModel.getModel(),
  };
}

function requestModelsEnabled(): boolean {
  return process.env.REQUEST_MODELS_ENABLED === 'true';
}

function buildMethodResponses<Response extends z.AnyZodObject>(
  responseModelType: NamedZodType<Response> | undefined,
  apiGatewayModelGenerator: ApiGatewayModelGenerator,
) {
  if (!responseModelType) {
    return undefined;
  }

  const commonErrorResponseModels: ResponseModel[] = [
    apiGatewayModelGenerator.getError400(),
    apiGatewayModelGenerator.getError401(),
    apiGatewayModelGenerator.getError403(),
    apiGatewayModelGenerator.getError404(),
    apiGatewayModelGenerator.getError500(),
  ];

  if (!responseModelsEnabled()) {
    return MethodResponses.toMethodResponses([...commonErrorResponseModels].filter(Boolean));
  }

  const responseModel = apiGatewayModelGenerator.generateModel(responseModelType);
  return MethodResponses.toMethodResponses(
    [
      new ResponseModel('200', responseModel),
      new ResponseModel('201', apiGatewayModelGenerator.generateGenericModel()),
      new ResponseModel('204', apiGatewayModelGenerator.generateGenericModel()),
      ...commonErrorResponseModels,
    ].filter(Boolean),
  );
}

function responseModelsEnabled(): boolean {
  return process.env.RESPONSE_MODELS_ENABLED === 'true';
}

function buildFunction<Request extends z.AnyZodObject, Response extends z.AnyZodObject>(
  props: RouteProps<Request, Response>,
) {
  const {
    handlerFunction,
    name,
    stack,
    bind,
    permissions,
    handler,
    environment,
    defaultAllowedOrigins,
    vpc,
  } = props;

  if (handlerFunction) return handlerFunction;

  return new SstFunction(stack, `${name}Function`, {
    bind,
    permissions,
    handler,
    environment: {
      [MemberStackEnvironmentKeys.SERVICE]: 'members',
      ...environment,
      [MemberStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS]:
        JSON.stringify(defaultAllowedOrigins),
    },
    vpc,
  });
}
