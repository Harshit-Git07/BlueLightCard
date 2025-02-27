import * as Factory from 'factory.ts';

import { companyFactory } from '@blc-mono/discovery/application/factories/CompanyFactory';
import { CompanyEntity, CompanyKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/CompanyEntity';

export const companyEntityFactory: Factory.Sync.Factory<CompanyEntity> = Factory.Sync.makeFactory({
  partitionKey: Factory.each((i) => CompanyKeyBuilders.buildPartitionKey((i + 1).toString())),
  sortKey: Factory.each((i) => CompanyKeyBuilders.buildSortKey((i + 1).toString())),
}).combine(companyFactory);
