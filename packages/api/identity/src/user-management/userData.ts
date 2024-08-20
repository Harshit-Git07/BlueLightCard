import { APIGatewayEvent, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { UserModel } from '../models/user';
import { CardModel } from '..//models/card';
import { BrandModel } from '..//models/brand';
import { Response } from '../../../core/src/utils/restResponse/response';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { isEmpty } from 'lodash';
import { unpackJWT } from './unpackJWT';
import {CompanyFollowsModel} from "../models/companyFollows";
import { CardStatus } from '../../../core/src/types/cardStatus.enum';

const service: string = process.env.service as string;

const logger = new Logger({ serviceName: `${service}-user-crud` });

const client = new DynamoDBClient({region: process.env.REGION ?? 'eu-west-2'});
const dynamodb = DynamoDBDocumentClient.from(client);
const tableName = process.env.identityTableName;

export const get = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.debug('input', { event });

  let authorization_header = "";
  if (event.headers.Authorization != undefined || event.headers.Authorization != "") {
    authorization_header = event.headers.Authorization??""
  }

  let jwtInfo = unpackJWT(authorization_header);

  // @ts-ignore: Object is possibly 'null'.

  const params_profile = {
    "TableName": tableName,
    "KeyConditionExpression": "#pk = :pk",
    "ExpressionAttributeNames": {
        "#pk": "pk"
    },
    "ExpressionAttributeValues": {
        ":pk": `MEMBER#${jwtInfo['custom:blc_old_uuid']}`
    }
  }

  try {
    logger.debug('param ', { params_profile });

    const results = await dynamodb.send(new QueryCommand(params_profile));

    logger.debug('Member Query Results ', results);

    let userDetails = {};
    let companyFollowsDetails:CompanyFollows[] = [];
    let cardDetails:CardModel[] = [];
    let brandDetails = {};


    results.Items?.map(i => {
      if(i.sk.includes('PROFILE')) {
        userDetails = UserModel.parse(i)
      } else if (i.sk.includes('CARD')) {
        cardDetails.push(CardModel.parse(i))
      } else if (i.sk.includes('BRAND')) {
        brandDetails = BrandModel.parse(i)
      } else if (i.sk.includes('COMPANYFOLLOWS')) {
        companyFollowsDetails.push(CompanyFollowsModel.parse(i))
      }
    })

    if(!isEmpty(userDetails)) {
      // Remove cards with null card ID
      const cards = cardDetails.filter(card => card.cardId !== 'null');
      const canRedeemOffer = getOfferRedeemStatus(cards);
      let responseModel = {
        profile: userDetails,
        cards: cards,
        companies_follows: companyFollowsDetails,
        ...brandDetails,
        canRedeemOffer
      }
      logger.info("User Found", responseModel);
      return Response.OK({ message: 'User Found', data: responseModel });
    }
    return Response.NotFound({ message: 'User not found' });

  } catch (error) {
    logger.error('error while fetching user details ',{error});
    return Response.Error(error as Error);
  }
};

type CompanyFollows = {
    companyId: string,
    likeType: string
}

function getOfferRedeemStatus(cards: CardModel[]): boolean {
  if (cards.length === 0) return false;

  // Sort cards by cardId descending
  cards.sort((card, nextCard) => Number(nextCard.cardId) - Number(card.cardId));

  const latestCard = cards[0];
  const previousCard = cards.length > 1 ? cards[1] : null;

  // Condition 1: Active Card Status
  const activeStatuses: CardStatus[] = [CardStatus.PHYSICAL_CARD, CardStatus.ADDED_TO_BATCH, CardStatus.USER_BATCHED];
  if (activeStatuses.includes(latestCard.cardStatus as CardStatus)) {
    return true;
  }

  // Condition 2: Renewal in Progress
  if (latestCard.cardStatus === CardStatus.AWAITING_ID_APPROVAL || latestCard.cardStatus === CardStatus.ID_APPROVED) {
    if (previousCard && previousCard.cardStatus === CardStatus.CARD_EXPIRED) {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      // Convert previousCard.expires from timestamp to Date
      const previousCardExpiryDate = new Date(Number(previousCard.expires));
      if (previousCardExpiryDate >= thirtyDaysAgo) {
        return true;
      }
    }
  }
  return false;
}
