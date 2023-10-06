import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { v4 } from 'uuid';
import { BannerModel, Banner } from '../../../models/banner';
import { convertDateUnix } from '../../../../../core/src/utils/date';

const PRODUCTION_ENV = 'production'
const PRODUCTION_CDN_URL = process.env.PRODUCTION_CDN_URL;
const STAGING_CDN_URL = process.env.STAGING_CDN_URL;

type BannerDetails = {
  bannerType: string;
  imageLocationPrefix: string;
  companyId: number;
};

export class BannerHandler {
  private service: string = process.env.SERVICE as string;
  private tableName = process.env.TABLE_NAME ?? '';
  private logger = new Logger({ serviceName: `${this.service}-banner` });
  private client = new DynamoDBClient({ region: process.env.REGION ?? 'eu-west-2' });
  private dynamodb = DynamoDBDocumentClient.from(this.client);

  constructor(private event: any) {}

  public async handleBannerCreated() {
    this.logger.info('Create Banner Handler');
    this.validateBrand();
    this.validatePayload();
    const bannerDetails = this.getBannerDetails();
    const data = this.fillBannerData(bannerDetails);
    const existingBanner = await this.find(data.legacyId, this.event.detail.brand);
    if(existingBanner && existingBanner.Count === 0){
      await this.save(data);
    }
  }

  public async handleBannerUpdated() {
    this.logger.info('Update Banner Handler');
    this.validateBrand();
    this.validatePayload();
    const bannerDetails = this.getBannerDetails();
    const existingBanner = await this.find(this.event.detail.id, this.event.detail.brand);
    if(existingBanner && existingBanner.Items !== null && (existingBanner.Count && existingBanner.Count > 0)){
      const bannerUuid = existingBanner.Items?.at(0) as Record <string, string>;
      const data = this.fillBannerData(bannerDetails, bannerUuid.id);
      await this.save(data);
    }
  }
  public async handleBannerDeleted() {
    this.logger.info('Delete Banner Handler');
    this.validateBrand();
    if(isNaN(Number(this.event.detail.id))) {
      throw new Error(`Invalid number for id`);
    }
    const existingBanner = await this.find(this.event.detail.id, this.event.detail.brand);
    if(existingBanner && existingBanner.Items !== null && (existingBanner.Count && existingBanner.Count > 0)){
      const bannerUuid = existingBanner.Items?.at(0) as Record <string, string>;
      await this.delete(bannerUuid.id);
    }
  }

  private validateBrand() {
    if(this.event.detail !== undefined && this.event.detail !== null
      && this.event.detail.brand !== undefined) {
      return true
    }
    this.logger.info('brand details missing', this.event);
    throw new Error('brand details missing');
  }

  private validatePayload() {
    this.logger.info('payload received', this.event.detail);
    const payload: Banner = this.event.detail;
    const result = BannerModel.safeParse(payload);
     if(!result.success) {
      throw new Error('Invalid Data');
     }
  }

  private getBannerDetails(): BannerDetails {
    const stage = this.event.detail.stage;

    let bannerType;
    let imageLocationPrefix = `${stage === PRODUCTION_ENV ? PRODUCTION_CDN_URL : STAGING_CDN_URL}`;
    let companyId = this.event.detail.cid;

    const bannerTypeMapping: { [key: number]: { bannerType: string; imageLocationSuffix: string } } = {
      10: {
        bannerType: 'takeover',
        imageLocationSuffix: `/complarge/cover/`,
      },
      11: {
        bannerType: 'bottom',
        imageLocationSuffix: '/img/promotion/bottom/',
      },
      12: {
        bannerType: 'menu',
        imageLocationSuffix: '/img/promotion/menu/',
      },
      13: {
        bannerType: 'sponsor',
        imageLocationSuffix: '/img/promotion/sponsor/',
      },
    };

    if (bannerTypeMapping.hasOwnProperty(this.event.detail.promotiontype)) {
      bannerType = bannerTypeMapping[this.event.detail.promotiontype].bannerType;
      imageLocationPrefix += bannerTypeMapping[this.event.detail.promotiontype].imageLocationSuffix;
    } else if (this.event.detail.promotiontype > 13 && companyId === 0) {
      bannerType = 'upgraded';
      imageLocationPrefix += '/complarge/cover/';
      companyId = this.event.detail.promotiontype;
    } else {
      bannerType = 'none';
      imageLocationPrefix = '';
    }

    return {
      bannerType: bannerType,
      imageLocationPrefix,
      companyId,
    };
  }

  private fillBannerData(bannerDetails: BannerDetails, uuid: string | Record<string, string> = v4()) {

    return {
      bannerUuid: uuid,
      legacyId: this.event.detail.id,
      name: this.event.detail.name,
      startsAt: convertDateUnix(this.event.detail.start),
      expiresAt: convertDateUnix(this.event.detail.end),
      status: this.event.detail.status === 1,
      link: this.event.detail.link,
      imageSource: `${bannerDetails.imageLocationPrefix}${this.event.detail.bannername}`,
      type: bannerDetails.bannerType,
      legacyCompanyId: bannerDetails.companyId,
      brand: this.event.detail.brand
    };
  }

  private async find(legacyId: number, brand: string) {
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: 'legacyId= :legacyId And brand = :brand',
      ProjectionExpression: 'id',
      ExpressionAttributeValues: {
        ':legacyId': legacyId,
        ':brand': brand,
      },
      IndexName: 'legacyId',
    };

    try {
      return await this.dynamodb.send(new QueryCommand(queryParams));
    } catch (err: any) {
      this.logger.info('DynamoDB query failed', { err });
      throw new Error(`DynamoDB query failed: ${err}`);
    }
  }

  private async save(data: any) {
     const Item: Record<string, string | number | boolean> = {
       id: data.bannerUuid,
       brand: data.brand,
       expiresAt: data.expiresAt,
       imageSource: data.imageSource,
       legacyCompanyId: data.legacyCompanyId,
       legacyId: data.legacyId,
       link: data.link,
       name: data.name,
       startsAt: data.startsAt,
       status: data.status,
       type: data.type,
     };

     const bannerParams = {
       TableName: this.tableName,
       Item,
     };

     try {
       return await this.dynamodb.send(new PutCommand(bannerParams));

     } catch (err: any) {
       this.logger.error('Cannot insert banner',{ err });
       throw new Error(`Cannot insert banner ${err}`);
     }

  }

  private async delete(id: string) {
    const bannerParams = {
      TableName: this.tableName,
      Key: {
        id: id,
      }
    }
    try {
      const results = await this.dynamodb.send(new DeleteCommand(bannerParams));
      this.logger.debug('results', { results });
    } catch (err: any) {
      this.logger.error('Cannot delete banner', { id, err });
      throw new Error(`Cannot delete banner ${err}`);

    }
  }

}
