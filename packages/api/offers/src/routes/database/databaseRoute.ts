import { RouteProps } from '../routeProps';
import { MethodResponses } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';

export class DatabaseRoute {
  constructor(private readonly routeProps: RouteProps) {}

  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /db': this.get(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: {
        handler: 'packages/api/offers/src/routes/database/databaseHandler.handler',
        permissions: ['secretsmanager:GetSecretValue'],
        vpc: this.routeProps.vpc,
        vpcSubnets: {
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        securityGroups: this.routeProps.securityGroups,
        enableLiveDev: false,
      },
      cdk: {
        method: {
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }
}
