import { FunctionProps } from 'sst/constructs';
import { IDatabaseAdapter } from '../../database/IDatabaseAdapter';

export type WithOffersDatabaseFunctionProps = FunctionProps & { database?: IDatabaseAdapter | undefined };
