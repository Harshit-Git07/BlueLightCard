import { Logger } from '@aws-lambda-powertools/logger';
import { UserModel } from '..//models/user';
import { CardModel } from '..//models/card';
import { BrandModel } from '..//models/brand';
import { UserRepository } from '../repositories/userRepository';
import { CompanyFollowsModel } from '../models/companyFollows';
import { isEmpty } from 'lodash';
import { getOfferRedeemStatus } from '../utils/cardUtils';

export class UserService {
  userRepository: UserRepository;
  userDetails: UserModel[] = [];
  private log: Logger;

  constructor(private readonly tableName: string, readonly region: string, logger: Logger) {
    this.userRepository = new UserRepository(tableName, region);
    this.log = logger;
  }

  public async findUserDetails(uuid: string) {
    try {
      this.userDetails = [];
      const results = await this.userRepository.findItemsByUuid(uuid);

      let userDetails = {};
      let cardDetails: CardModel[] = [];
      let brandDetails = {};
      let companyFollowsDetails: CompanyFollowsModel[] = [];

      results.Items?.map((i) => {
        if (i.sk.includes('PROFILE')) {
          userDetails = UserModel.parse(i);
        } else if (i.sk.includes('CARD')) {
          cardDetails.push(CardModel.parse(i));
        } else if (i.sk.includes('BRAND')) {
          brandDetails = BrandModel.parse(i);
        } else if (i.sk.includes('COMPANYFOLLOWS')) {
          companyFollowsDetails.push(CompanyFollowsModel.parse(i));
        }
      });

      if (isEmpty(userDetails)) {
        this.log.debug('User Not Found by UUID', { uuid });
        return null;
      }

      // Remove cards with null card ID
      const cards = cardDetails.filter((card) => card.cardId !== 'null');
      const canRedeemOffer = getOfferRedeemStatus(cards);
      let responseModel = {
        profile: userDetails,
        cards: cards,
        companies_follows: companyFollowsDetails,
        ...brandDetails,
        canRedeemOffer,
      };

      this.log.debug('User Found', responseModel);
      return responseModel;
    } catch (error) {
      throw new Error('error while fetching data from DB');
    }
  }
}
