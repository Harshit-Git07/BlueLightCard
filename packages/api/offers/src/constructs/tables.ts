import { Table } from 'sst/constructs'
import { Stack } from 'aws-cdk-lib'

/**
 *  This class creates all the tables for the Offers API
 *  @param stack - The stack to add the tables to
 */
export class Tables {
  brandTable: Table
  offerTable: Table
  companyTable: Table
  categoryTable: Table
  offerTypeTable: Table
  bannersTable: Table
  tagsTable: Table
  offerBrandConnectionTable: Table;
  offerCategoryConnectionTable: Table;
  offerTypeConnectionTable: Table;
  offerTagConnectionTable: Table;
  companyTagConnectionTable: Table;
  companyCategoryConnectionTable: Table;
  companyBrandConnectionTable: Table;

  constructor (private stack: Stack) {
    this.brandTable = this.createBrandTable();
    this.offerTable = this.createOfferTable();
    this.companyTable = this.createCompanyTable();
    this.categoryTable = this.createCategoryTable();
    this.offerTypeTable = this.createOfferTypeTable();
    this.bannersTable = this.createBannersTable();
    this.tagsTable = this.createTagsTable();
    this.offerBrandConnectionTable = this.createOfferBrandConnectionTable();
    this.offerCategoryConnectionTable = this.createOfferCategoryConnectionTable();
    this.offerTypeConnectionTable = this.createOfferTypeConnectionTable();
    this.offerTagConnectionTable = this.createOfferTagConnectionTable();
    this.companyTagConnectionTable = this.createCompanyTagConnectionTable();
    this.companyCategoryConnectionTable = this.createCompanyCategoryConnectionTable();
    this.companyBrandConnectionTable = this.createCompanyBrandConnectionTable();
  }

  private createBrandTable (): Table {
    return new Table(this.stack, 'brand', {
      fields: {
        id: 'string',
      },
      primaryIndex: {
        partitionKey: 'id',
      }
    })
  }

  private createOfferTable (): Table {
    return new Table(this.stack, 'offer', {
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
    return new Table(this.stack, 'company', {
      fields: {
        id: 'string',
      },
      primaryIndex: {
        partitionKey: 'id',
      },
    })
  }

  private createCategoryTable (): Table {
    return new Table(this.stack, 'category', {
      fields: {
        id: 'string',
        legacyId: 'string', // Value: Brand#legacyID - ex: blc-uk#1209
        parentCategoryId: 'string',
        name: 'string',
        type: 'string', //Values: offer or company
      },
      primaryIndex: {
        partitionKey: 'id',
      },
      globalIndexes: {
        type: {
          partitionKey: 'type',
          sortKey: 'name'
        },
        legacyId: {
          partitionKey: 'legacyId',
        },
        parentCategoryId: {
          partitionKey: 'parentCategoryId',
          sortKey: 'name'
        }
      }
    })
  }

  private createOfferTypeTable (): Table {
    return new Table(this.stack, 'offerType', {
      fields: {
        id: 'string',
        legacyId: 'number', // OfferId Column in the legacy DB
      },
      primaryIndex: {
        partitionKey: 'id',
      },
      globalIndexes: {
        legacyId: {
          partitionKey: 'legacyId',
        }
      },
    })
  }

  private createTagsTable (): Table {
    return new Table(this.stack, 'tags', {
      fields: {
        id: 'string',
        name: 'string',
      },
      primaryIndex: {
        partitionKey: 'id',
      },
      globalIndexes: {
        name: {
          partitionKey: 'name',
        }
      },
    })
  }

  private createOfferBrandConnectionTable (): Table {
    return new Table(this.stack, 'offerBrandConnection', {
      fields: {
        offerId: 'string',
        brandId: 'string',
      },
      primaryIndex: {
        partitionKey: 'brandId',
        sortKey: 'offerId',
      },
      globalIndexes: {
        offerId: {
          partitionKey: 'offerId',
          sortKey: 'brandId',
        }
      }
    })
  }

  private createOfferCategoryConnectionTable (): Table {
    return new Table(this.stack, 'offerCategoryConnection', {
      fields: {
        offerId: 'string',
        categoryId: 'string',
      },
      primaryIndex: {
        partitionKey: 'categoryId',
        sortKey: 'offerId',
      },
      globalIndexes: {
        offerId: {
          partitionKey: 'offerId',
          sortKey: 'categoryId',
        }
      }
    })
  }

  private createOfferTypeConnectionTable (): Table {
    return new Table(this.stack, 'offerTypeConnection', {
      fields: {
        offerId: 'string',
        offerTypeId: 'string',
      },
      primaryIndex: {
          partitionKey: 'offerTypeId',
          sortKey: 'offerId',
      },
      globalIndexes: {
        offerId: {
          partitionKey: 'offerId',
          sortKey: 'offerTypeId',
        }
      }
    })
  }

  private createOfferTagConnectionTable (): Table {
    return new Table(this.stack, 'offerTagConnection', {
      fields: {
        offerId: 'string',
        tagId: 'string',
      },
      primaryIndex: {
        partitionKey: 'offerId',
        sortKey: 'tagId',
      }
    })
  }

  private createCompanyTagConnectionTable (): Table {
    return new Table(this.stack, 'companyTagConnection', {
      fields: {
        companyId: 'string',
        tagId: 'string',
      },
      primaryIndex: {
        partitionKey: 'companyId',
        sortKey: 'tagId',
      },
    })
  }

  private createCompanyCategoryConnectionTable (): Table {
    return new Table(this.stack, 'companyCategoryConnection', {
      fields: {
        companyId: 'string',
        categoryId: 'string',
      },
      primaryIndex: {
        partitionKey: 'companyId',
        sortKey: 'categoryId',
      },
      globalIndexes: {
        categoryId: {
          partitionKey: 'categoryId',
          sortKey: 'companyId',
        }
      }
    });
  }

  private createCompanyBrandConnectionTable (): Table {
    return new Table(this.stack, 'companyBrandConnection', {
      fields: {
        companyId: 'string',
        brandId: 'string',
      },
      primaryIndex: {
        partitionKey: 'brandId',
        sortKey: 'companyId',
      },
      globalIndexes: {
        companyId: {
          partitionKey: 'companyId',
          sortKey: 'brandId',
        }
      }
    });
  }

  private createBannersTable (): Table {
    return new Table(this.stack, 'banners', {
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
