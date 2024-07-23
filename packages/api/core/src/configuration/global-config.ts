import { EndpointType } from 'aws-cdk-lib/aws-apigateway';
import { isProduction, isStaging } from '../utils/checkEnvironment';

type GlobalConfig = {
  apiGatewayEndpointTypes: EndpointType[];
}

export class GlobalConfigResolver {
  public static for(stage: string): GlobalConfig {
    if (isProduction(stage)) {
      return this.forProductionStage();
    } else if (isStaging(stage)) {
      return this.forStagingStage();
    } else {
      return this.forDevelopmentStage();
    }
  }

  public static forProductionStage(): GlobalConfig {
    return {
      apiGatewayEndpointTypes: [EndpointType.EDGE]
    }
  }

  public static forStagingStage(): GlobalConfig {
    return {
      apiGatewayEndpointTypes: [EndpointType.EDGE]
    }
  }

  public static forDevelopmentStage(): GlobalConfig {
    return {
      apiGatewayEndpointTypes: [EndpointType.REGIONAL]
    }
  }
}


