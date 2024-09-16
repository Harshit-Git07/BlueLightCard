import { PutCommandOutput, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { CardRepository } from "src/repositories/cardRepository";


export interface ICardService {
  getUserCurrentCard(event: any): Promise<QueryCommandOutput>;
  updateUsersCard(userCurrentCardsresults: QueryCommandOutput, event: any): Promise<PutCommandOutput>;
}

export class CardService implements ICardService{
  public cardRepository: CardRepository;
  
  constructor(private readonly tableName: string, private readonly region: string) {
    this.cardRepository = new CardRepository(tableName, region);
  }

  async getUserCurrentCard(event: any) {
    const uuid = event.detail.uuid;
    const legacyCardId = event.detail.cardNumber;
    return await this.cardRepository.getUserCurrentCard(uuid, legacyCardId)
  }

  async updateUsersCard(previousCards: QueryCommandOutput, event: any): Promise<PutCommandOutput> {
    const uuid = event.detail.uuid;
    const legacyCardId = event.detail.cardNumber;
    const newExpiry = event.detail.expires;
    const newPosted = event.detail.posted;
    const cardStatus = event.detail.cardStatus;
    return await this.cardRepository.updateUsersCard(previousCards, newExpiry, newPosted, uuid, legacyCardId, cardStatus);
  }

}
