import { Logger } from '@aws-lambda-powertools/logger';
import { TransactRepository } from '../repositories/transactRepository';

export class TransactionService {
  private transactionRepository: TransactRepository;

  constructor(private readonly logger: Logger) {
    this.transactionRepository = new TransactRepository();
  }

  public async writeTransaction(transactionParams: any[]) {
    try {
      await this.transactionRepository.transactWrite(transactionParams);
    } catch (error) {
      this.logger.error('transactional write failed', { error });
      throw error;
    }
  }
}
