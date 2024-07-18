import { MethodResponses } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { OffersFunction } from 'src/constructs/sst/OffersFunction';
import { RouteProps } from '../routeProps';
import { CategoryMenuModel, CompanyMenuModel, OffersHomepageModel } from '../../models/offersHomepage';
import { Model } from 'aws-cdk-lib/aws-apigateway';

export class OffersHomepageRoutes {
  private readonly model: Record<string, Model>;

  constructor(private readonly routeProps: RouteProps) {
    this.model = this.routeProps.model as Record<string, Model>;
  }
  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /homepage/companies': this.getCompanies(),
      'GET /homepage/categories': this.getCategories(),
      'GET /homepage/offer-menus': this.getOfferMenus(),
    });
  }

  private getCompanies(): ApiGatewayV1ApiRouteProps<any> {
    return {
      cdk: {
        function: new OffersFunction(this.routeProps.stack, 'CompaniesMenuHandler', {
          handler: 'packages/api/offers/src/routes/homepage/getCompaniesHandler.handler',
          environment: {
            OFFER_HOMEPAGE_TABLE_NAME: this.routeProps.dynamoTables!.offerHomepageTable.tableName,
          },
          permissions: ['dynamodb:GetItem'],
        }),
        method: {
          requestModels: {
            'application/json': this.model[CompanyMenuModel._ModelName],
          },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }

  private getCategories(): ApiGatewayV1ApiRouteProps<any> {
    return {
      cdk: {
        function: new OffersFunction(this.routeProps.stack, 'CategoriesMenuHandler', {
          handler: 'packages/api/offers/src/routes/homepage/getCategoriesHandler.handler',
          environment: {
            OFFER_HOMEPAGE_TABLE_NAME: this.routeProps.dynamoTables!.offerHomepageTable.tableName,
          },
          permissions: ['dynamodb:GetItem'],
        }),
        method: {
          requestModels: { 'application/json': this.model[CategoryMenuModel._ModelName] },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }

  private getOfferMenus(): ApiGatewayV1ApiRouteProps<any> {
    return {
      cdk: {
        function: new OffersFunction(this.routeProps.stack, 'OfferMenusHandler', {
          handler: 'packages/api/offers/src/routes/homepage/getOffersMenusHandler.handler',
          environment: {
            OFFER_HOMEPAGE_TABLE_NAME: this.routeProps.dynamoTables!.offerHomepageTable.tableName,
          },
          permissions: ['dynamodb:BatchGetItem'],
        }),
        method: {
          requestModels: { 'application/json': this.model[OffersHomepageModel._ModelName] },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }
}
