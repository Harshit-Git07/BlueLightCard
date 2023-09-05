import { Table } from 'sst/constructs'
import { Stack } from 'aws-cdk-lib'

/**
 *  This class creates all the tables for the Offers API
 *  @param stack - The stack to add the tables to
 */
export class Tables {
  brandTable: Table
  homePageTable: Table
  offersContainerTable: Table
  offersContainer_offerTable: Table
  offerTable: Table
  companyTable: Table
  categoryTable: Table
  offerTypeTable: Table
  offers_brandTable: Table
  offers_categoryTable: Table
  bannersTable: Table

  constructor (private stack: Stack) {
    this.brandTable = this.createBrandTable()
    this.homePageTable = this.createHomePageTable()
    this.offersContainerTable = this.createOffersContainerTable()
    this.offersContainer_offerTable = this.createOffersContainerOfferTable()
    this.offerTable = this.createOfferTable()
    this.companyTable = this.createCompanyTable()
    this.categoryTable = this.createCategoryTable()
    this.offerTypeTable = this.createOfferTypeTable()
    this.offers_brandTable = this.createOffersBrandTable()
    this.offers_categoryTable = this.createOffersCategoryTable()
    this.bannersTable = this.createBannersTable()
  }

  private createBrandTable (): Table {
    return new Table(this.stack, 'brandtable', {
      fields: {
        id: 'string',
        homePageId: 'string',
      },
      primaryIndex: {
        partitionKey: 'id',
      },
      globalIndexes: {
        homePageId: {
          partitionKey: 'homePageId',
        },
      },
    })
  }

  private createHomePageTable (): Table {
    return new Table(this.stack, 'homePageTable', {
      fields: {
        id: 'string',
      },
      primaryIndex: {
        partitionKey: 'id',
      },
    })
  }

  private createOffersContainerTable (): Table {
    return new Table(this.stack, 'offersContainerTable', {
      fields: {
        id: 'string',
        homePageId: 'string',
      },
      primaryIndex: {
        partitionKey: 'id',
      },
      globalIndexes: {
        homePageId: {
          partitionKey: 'homePageId',
        },
      },
    })
  }

  private createOffersContainerOfferTable (): Table {
    return new Table(this.stack, 'offersContainerOfferTable', {
      fields: {
        offersContainerId: 'string',
        offerId: 'string',
      },
      primaryIndex: {
        partitionKey: 'offerId',
        sortKey: 'offersContainerId',
      },
      globalIndexes: {
        offersContainerId: {
          partitionKey: 'offersContainerId',
          sortKey: 'offerId',
        },
      },
    })
  }

  private createOfferTable (): Table {
    return new Table(this.stack, 'offerTable', {
      fields: {
        id: 'string',
        offerTypeId: 'string',
      },
      primaryIndex: {
        partitionKey: 'id',
      },
      globalIndexes: {
        offerTypeId: {
          partitionKey: 'offerTypeId',
        },
      },
    })
  }

  private createCompanyTable (): Table {
    return new Table(this.stack, 'companyTable', {
      fields: {
        id: 'string',
      },
      primaryIndex: {
        partitionKey: 'id',
      },
    })
  }

  private createCategoryTable (): Table {
    return new Table(this.stack, 'categoryTable', {
      fields: {
        id: 'string',
      },
      primaryIndex: {
        partitionKey: 'id',
      },
    })
  }

  private createOfferTypeTable (): Table {
    return new Table(this.stack, 'offerTypeTable', {
      fields: {
        id: 'string',
      },
      primaryIndex: {
        partitionKey: 'id',
      },
    })
  }

  private createOffersBrandTable (): Table {
    return new Table(this.stack, 'offersBrandTable', {
      fields: {
        offerId: 'string',
        brandId: 'string',
      },
      primaryIndex: {
        partitionKey: 'offerId',
        sortKey: 'brandId',
      },
      globalIndexes: {
        brandId: {
          partitionKey: 'brandId',
          sortKey: 'offerId',
        },
      },
    })
  }

  private createOffersCategoryTable (): Table {
    return new Table(this.stack, 'offersCategoryTable', {
      fields: {
        offerId: 'string',
        categoryId: 'string',
      },
      primaryIndex: {
        partitionKey: 'offerId',
        sortKey: 'categoryId',
      },
      globalIndexes: {
        categoryId: {
          partitionKey: 'categoryId',
          sortKey: 'offerId',
        },
      },
    })
  }

  private createBannersTable (): Table {
    return new Table(this.stack, 'bannersTable', {
      fields: {
        id: 'string',
        legacyId: 'number',
        type: 'string',
        expiresAt: 'number',
        legacyCompanyId: 'number',
        brand: 'string',
      },
      primaryIndex: {
        partitionKey: 'id',
      },
      globalIndexes: {
        type: {
          partitionKey: 'type',
          sortKey: 'expiresAt',
        },
        legacyId: {
          partitionKey: 'legacyId',
          sortKey: 'brand',
        },
        companyId: {
          partitionKey: 'legacyCompanyId',
          sortKey: 'brand',
        },
      },
    })
  }
}
