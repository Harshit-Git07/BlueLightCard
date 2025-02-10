import * as Factory from 'factory.ts';

import { SubMenu } from '../models/ThemedMenu';

export const subMenuFactory = Factory.Sync.makeFactory<SubMenu>({
  id: Factory.each((i) => (i + 1).toString()),
  description: 'Sample description',
  imageURL: 'https://cdn.bluelightcard.co.uk/offerimages/1724052659175.jpg',
  title: 'Sample SubMenu title',
  position: Factory.each((i) => i),
});
