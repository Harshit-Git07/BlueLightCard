import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { UpdateMemberProfileCustomerRoute } from '../UpdateMemberProfileCustomerRoute';
import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';

jest.mock('@blc-mono/core/extensions/apiGatewayExtension');
jest.mock('aws-cdk-lib/aws-iam');

describe('UpdateMemberProfileRoute', () => {
  let apiGatewayModelGenerator: jest.Mocked<ApiGatewayModelGenerator>;
  let agMemberProfileCustomerModel: jest.Mocked<Model>;
  let profileTableName: string;
  let route: UpdateMemberProfileCustomerRoute;

  beforeEach(() => {
    const mockRestApi = {} as jest.Mocked<RestApi>;
    apiGatewayModelGenerator = new ApiGatewayModelGenerator(
      mockRestApi,
    ) as jest.Mocked<ApiGatewayModelGenerator>;
    agMemberProfileCustomerModel = new Model(mockRestApi, 'TestModel', {}) as jest.Mocked<Model>;
    profileTableName = 'test-profile-table';
    route = new UpdateMemberProfileCustomerRoute(
      apiGatewayModelGenerator,
      agMemberProfileCustomerModel,
      profileTableName,
    );
  });

  it('should initialize the class properties correctly', () => {
    expect(route).toBeDefined();
    expect(route['apiGatewayModelGenerator']).toBe(apiGatewayModelGenerator);
    expect(route['agMemberProfileCustomerModel']).toBe(agMemberProfileCustomerModel);
    expect(route['profileTableName']).toBe(profileTableName);
  });

  describe('getRouteDetails', () => {
    it('should return the correct route details', () => {
      const routeDetails: any = route.getRouteDetails();

      expect(routeDetails).toEqual({
        function: {
          handler:
            'packages/api/members/application/handlers/profile/updateMemberProfileCustomer.handler',
          environment: {
            SERVICE: 'member',
            PROFILE_TABLE_NAME: profileTableName,
          },
          permissions: [expect.any(PolicyStatement)],
        },
        authorizer: 'none',
        cdk: {
          method: {
            requestModels: { 'application/json': agMemberProfileCustomerModel.getModel() },
            methodResponses: MethodResponses.toMethodResponses([
              expect.any(ResponseModel),
              apiGatewayModelGenerator.getError400(),
              apiGatewayModelGenerator.getError404(),
              apiGatewayModelGenerator.getError500(),
            ]),
          },
        },
      });
    });
  });
});
