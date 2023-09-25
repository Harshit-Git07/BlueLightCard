import { handler } from '../typeLambdaResolver';
import { OfferFieldsResolver} from '../offerFieldsResolver';
import { CompanyFieldsResolver} from '../companyFieldsResolver';
import { beforeEach, expect } from '@jest/globals'
import { AppSyncResolverEvent } from 'aws-lambda'

jest.mock('../offerFieldsResolver');
jest.mock('../companyFieldsResolver');
describe('Type Lambda Resolver', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call OfferFieldsResolver when parentTypeName is Offer and fieldName is categories', async () => {
    // @ts-ignore
    const event = {
      info: {
        parentTypeName: 'Offer',
        fieldName: 'categories'
      },
      source: {
        id: 'offerId123'
      }
    } as AppSyncResolverEvent<any>;

    (OfferFieldsResolver.prototype.resolveCategories as jest.Mock).mockResolvedValue(['sampleCategory']);
    const result = await handler(event as AppSyncResolverEvent<any>);
    expect(result).toEqual(['sampleCategory']);
    expect(OfferFieldsResolver.prototype.resolveCategories).toHaveBeenCalledTimes(1);
    expect(OfferFieldsResolver.prototype.resolveTypes).toHaveBeenCalledTimes(0);
    expect(OfferFieldsResolver.prototype.resolveBrands).toHaveBeenCalledTimes(0);
  });

  test('should call OfferFieldsResolver when parentTypeName is Offer and fieldName is brands', async () => {
    // @ts-ignore
    const event = {
      info: {
        parentTypeName: 'Offer',
        fieldName: 'brands'
      },
      source: {
        id: 'offerId123'
      }
    } as AppSyncResolverEvent<any>;

    (OfferFieldsResolver.prototype.resolveBrands as jest.Mock).mockResolvedValue(['sampleBrands']);
    const result = await handler(event as AppSyncResolverEvent<any>);
    expect(result).toEqual(['sampleBrands']);
    expect(OfferFieldsResolver.prototype.resolveTypes).toHaveBeenCalledTimes(0);
    expect(OfferFieldsResolver.prototype.resolveCategories).toHaveBeenCalledTimes(0);
    expect(OfferFieldsResolver.prototype.resolveBrands).toHaveBeenCalledTimes(1);
  });

  test('should call OfferFieldsResolver when parentTypeName is Offer and fieldName is types', async () => {
    // @ts-ignore
    const event = {
      info: {
        parentTypeName: 'Offer',
        fieldName: 'types'
      },
      source: {
        id: 'offerId123'
      }
    } as AppSyncResolverEvent<any>;

    (OfferFieldsResolver.prototype.resolveTypes as jest.Mock).mockResolvedValue(['sampleTypes']);
    const result = await handler(event as AppSyncResolverEvent<any>);
    expect(result).toEqual(['sampleTypes']);
    expect(OfferFieldsResolver.prototype.resolveTypes).toHaveBeenCalledTimes(1);
    expect(OfferFieldsResolver.prototype.resolveBrands).toHaveBeenCalledTimes(0);
    expect(OfferFieldsResolver.prototype.resolveCategories).toHaveBeenCalledTimes(0);
  });

  test('should call CompanyFieldsResolver when parentTypeName is Company and fieldName is brands', async () => {
    // @ts-ignore
    const event = {
      info: {
        parentTypeName: 'Company',
        fieldName: 'brands'
      },
      source: {
        id: 'companyId123'
      }
    } as AppSyncResolverEvent<any>;

    (CompanyFieldsResolver.prototype.resolveBrands as jest.Mock).mockResolvedValue(['sampleBrands']);
    const result = await handler(event as AppSyncResolverEvent<any>);
    expect(result).toEqual(['sampleBrands']);
    expect(CompanyFieldsResolver.prototype.resolveBrands).toHaveBeenCalledTimes(1);
    expect(CompanyFieldsResolver.prototype.resolveCategories).toHaveBeenCalledTimes(0);
  });

  test('should call CompanyFieldsResolver when parentTypeName is Company and fieldName is categories', async () => {
    // @ts-ignore
    const event = {
      info: {
        parentTypeName: 'Company',
        fieldName: 'categories'
      },
      source: {
        id: 'companyId123'
      }
    } as AppSyncResolverEvent<any>;

    (CompanyFieldsResolver.prototype.resolveCategories as jest.Mock).mockResolvedValue(['sampleCategories']);
    const result = await handler(event as AppSyncResolverEvent<any>);
    expect(result).toEqual(['sampleCategories']);
    expect(CompanyFieldsResolver.prototype.resolveBrands).toHaveBeenCalledTimes(0);
    expect(CompanyFieldsResolver.prototype.resolveCategories).toHaveBeenCalledTimes(1);
  });

  test('should throw an error when resolver not found', async () => {
    // @ts-ignore
    const event = {
      info: {
        parentTypeName: 'Company',
        fieldName: 'invalidField'
      },
      source: {
        id: 'companyId123'
      }
    } as AppSyncResolverEvent<any>;

    await expect(handler(event as AppSyncResolverEvent<any>)).rejects.toThrow('Resolver Company:invalidField not found.');
  })


});
