import { DataSource } from '../dataSources';
import { IResolver } from './iResolver';
import { QueryResolver } from './queries/queryResolver';
import { TypeResolver } from './types/typeResolver';

/**
 * This class centralises the creation of all resolvers.
 */
export class Resolver implements IResolver {
  constructor(private dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  initialise() {
    new TypeResolver(this.dataSource).initialise();
    new QueryResolver(this.dataSource).initialise();
  }
}
