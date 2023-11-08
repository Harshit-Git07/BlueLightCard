import { Stack } from 'aws-cdk-lib'
export class Tags {
  constructor(private stack: Stack) {
    stack.tags.setTag('service', 'offers');
    stack.tags.setTag('map-migrated', 'd-server-017zxazumgiycz');
  }

}
