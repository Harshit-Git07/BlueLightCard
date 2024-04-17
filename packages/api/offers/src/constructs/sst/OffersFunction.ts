import { Stack, Function } from 'sst/constructs';

import { WithOffersDatabaseFunctionProps } from './types';
import { Duration } from 'aws-cdk-lib';

export class OffersFunction extends Function {
  constructor(stack: Stack, id: string, props: WithOffersDatabaseFunctionProps) {
    const functionProps = props.database ? props.database.props(props) : props;
    super(stack, `${id}-${stack.stage}`, {
      timeout: Duration.seconds(5).toSeconds(),
      memorySize: 256,
      ...functionProps,
      environment: {
        SERVICE: 'offers',
        REGION: stack.region,
        ...functionProps.environment,
      },
    });
  }
}
