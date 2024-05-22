import { OfferListItemModel } from '@/models/offer';
import * as Factory from 'factory.ts';
import { SearchResultV5 } from '@/modules/SearchResults/types';

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

export const searchResultV5Factory = Factory.Sync.makeFactory<SearchResultV5>({
  ID: Factory.each((i) => i),
  CatID: Factory.each((i) => i),
  TypeID: Factory.each((i) => i),
  CompID: Factory.each((i) => i),
  S3Logos: '',
  Logos: '',
  AbsoluteLogos: '',
  CompanyName: '',
  OfferName: '',
});
