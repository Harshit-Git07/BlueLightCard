import { Stack } from 'aws-cdk-lib';
import { Tables } from './tables';
import { EventBus, Queue, use } from 'sst/constructs';
import { Shared } from '../../../../../stacks/stack';
import { bannerRule } from '../eventBridge/rules/bannerRule';
import { companyRule } from '../eventBridge/rules/companyRule';
import { Queues } from "./queues";

export class EventBridge {
  private bus: EventBus;

  constructor(private stack: Stack, private stage: string, private tables: Tables,  private queues: Queues) {
    const { bus } = use(Shared);
    this.bus = bus;
    this.createRules();
  }

  private createRules() {
    this.bus.addRules(this.stack, bannerRule(this.tables.bannersTable.tableName, this.queues.bannerDlq.cdk.queue));
    this.bus.addRules(this.stack, companyRule(this.tables, this.queues.companiesDlq.cdk.queue));
  }
}
