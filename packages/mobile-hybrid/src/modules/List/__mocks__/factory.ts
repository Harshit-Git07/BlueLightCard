import { OfferListItemModel } from '@/models/offer';
import * as Factory from 'factory.ts';

export const offerListItemFactory = Factory.Sync.makeFactory<OfferListItemModel>({
  id: Factory.each((i) => i),
  catid: Factory.each((i) => i),
  typeid: Factory.each((i) => i),
  compid: Factory.each((i) => i),
  available_offer_types: [],
  available_offer_cats: [],
  logos: '',
  companyname: '',
  image: '',
  s3Image: '',
  absoluteLogos: '',
  s3logos: '',
  absoluteImage: '',
  offername: '',
});
