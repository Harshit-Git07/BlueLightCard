import { EndpointType } from 'aws-cdk-lib/aws-apigateway';
import { STAGES } from '../types/stages.enum';

type GlobalConfig = {
  apiGatewayEndpointTypes: EndpointType[];
}

export class GlobalConfigResolver {
  public static for(stage: string): GlobalConfig {
    switch (stage as STAGES) {
      case STAGES.PRODUCTION:
        return this.forProductionStage()
      case STAGES.STAGING:
        return this.forStagingStage()
      default:
        return this.forDevelopmentStage()
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


