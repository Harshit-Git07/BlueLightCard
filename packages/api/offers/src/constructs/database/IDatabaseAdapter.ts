import { DatabaseConfig } from './type';
import { FunctionProps } from 'sst/constructs';
import { Database } from './database';

export interface IDatabaseAdapter {
  details: Database;
  config: DatabaseConfig;
  props(additionalProps: FunctionProps): FunctionProps;
}
