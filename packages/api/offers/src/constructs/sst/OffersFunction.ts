import { Stack, Function } from 'sst/constructs';

import { WithOffersDatabaseFunctionProps } from './types';

export class OffersFunction extends Function {
  constructor(stack: Stack, id: string, props: WithOffersDatabaseFunctionProps) {
    const functionProps = props.database ? props.database.props(props) : props;
    super(stack, `${id}-${stack.stage}`, functionProps);
  }
}
