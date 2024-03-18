import { Logger } from '@aws-lambda-powertools/logger';
import { CardModel } from 'src/models/card';
import { UserRepository } from 'src/repositories/userRepository';

export class PreTokenGenerateService {
  userRepository: UserRepository;
  cardDetails: CardModel[] = [];
  private log: Logger;

  constructor(readonly tableName: string, readonly region: string, logger: Logger) {
    this.userRepository = new UserRepository(tableName, region);
    this.log = logger;
  }

  public async findLatestCardStatus(uuid: string): Promise<string> {
    try {
      this.cardDetails = [];
      const cardStatusResponse = await this.userRepository.findItemsByUuid(uuid);

      cardStatusResponse.Items?.map((i) => {
        if (i.sk.includes('CARD') && CardModel.parse(i).cardId !== 'null') {
          this.cardDetails.push(CardModel.parse(i));
        }
      });

      if (this.cardDetails.length > 0) {
        return this.cardDetails.reduce((prev, cur) => (prev.cardId > cur.cardId ? prev : cur)).cardStatus;
      } else {
        this.log.debug('Unable to find card details for user uuid: ' + uuid);
        return '';
      }
    } catch (error) {
      throw new Error('error while fetching data from DB');
    }
  }
}
