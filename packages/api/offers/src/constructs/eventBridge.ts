import { Stack } from 'aws-cdk-lib';
import { Tables } from './tables';
import { EventBus, Queue, use } from 'sst/constructs';
import { Shared } from '../../../../../stacks/stack';
import { bannerRule } from '../eventBridge/rules/bannerRule';

export class EventBridge {
  private bus: EventBus;
  private bannerDlq: Queue;

  constructor(private stack: Stack, private stage: string, private tables: Tables) {
    const { bus } = use(Shared);
    this.bus = bus;
    this.bannerDlq = new Queue(stack, `BannerDLQ`);
    this.createRules();
  }

  private createRules() {
    this.bus.addRules(this.stack, bannerRule(this.tables.bannersTable.tableName, this.bannerDlq.cdk.queue));
  }
}
