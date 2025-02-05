import { Function, FunctionProps, Stack } from 'sst/constructs';

export class SSTFunction extends Function {
  constructor(stack: Stack, id: string, functionProps: FunctionProps) {
    super(stack, `${id}-${stack.stage}`, functionProps);
  }
}
