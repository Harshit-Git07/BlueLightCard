import { Stack } from 'aws-cdk-lib'
import { generateConstructId } from '@blc-mono/core/utils/generateConstuctId';
export class Tags {
  constructor(private stack: Stack) {
    stack.tags.setTag('service', generateConstructId('offers', stack.stackName));
    stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz')
  }

}
