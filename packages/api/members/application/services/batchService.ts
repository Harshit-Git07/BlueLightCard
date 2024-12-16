import { BatchRepository } from '@blc-mono/members/application/repositories/batchRepository';
import { logger } from '@blc-mono/members/application/middleware';
import {
  CreateBatchModel,
  UpdateBatchModel,
} from '@blc-mono/members/application/models/batchModel';
import { BatchEntryModel } from '@blc-mono/members/application/models/batchEntryModel';
import { CardModel } from '@blc-mono/members/application/models/cardModel';
import { PrintingErrorStatus } from '@blc-mono/members/application/models/enums/PrintingErrorStatus';
import { CardService } from '@blc-mono/members/application/services/cardService';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { CreateInternalBatchModelResponse } from '@blc-mono/members/application/models/batchModel';
import { CardStatus } from '@blc-mono/members/application/models/enums/CardStatus';
import { ExternalCardPrintingDataModel } from '@blc-mono/members/application/models/ExternalCardPrintingDataModel';
import { Bucket } from 'sst/node/bucket';
import { BatchType } from '@blc-mono/members/application/models/enums/BatchType';
import { ProfileModel } from '@blc-mono/members/application/models/profileModel';
import { ApplicationModel } from '@blc-mono/members/application/models/applicationModel';
import { formatDateDDMMYYYY } from 'client/src/common/utils/dates';
import { getBrandFromEnv, isBlcAuBrand, isBlcUkBrand } from '@blc-mono/core/utils/checkBrand';
import { MAP_BRAND } from '@blc-mono/core/constants/common';
import { S3 } from 'aws-sdk';
import { S3EventRecord } from 'aws-lambda';
import { Client } from 'basic-ftp';
import path from 'path';

const MAX_NAME_ON_CARD_CHARACTER_LIMIT = 25;
const EXTERNAL_BATCH_SIZE_LIMIT = 500;

export class BatchService {
  constructor(
    private repository: BatchRepository = new BatchRepository(),
    private cardService: CardService = new CardService(),
    private profileService: ProfileService = new ProfileService(),
    private s3Client: S3 = new S3({}),
  ) {}

  async createBatch(batch: CreateBatchModel): Promise<string> {
    try {
      logger.debug({ message: 'Creating batch' });
      return await this.repository.createBatch(batch);
    } catch (error) {
      logger.error({ message: 'Error creating batch', error });
      throw error;
    }
  }

  async createBatchEntry(batchEntry: BatchEntryModel): Promise<string> {
    try {
      logger.debug({ message: 'Creating batch entry' });
      return await this.repository.createBatchEntry(batchEntry);
    } catch (error) {
      logger.error({ message: 'Error creating batch entry', error });
      throw error;
    }
  }

  async updateBatch(batchId: string, batchUpdateModel: UpdateBatchModel): Promise<void> {
    try {
      logger.debug({ message: 'Updating batch' });
      return await this.repository.updateBatch(batchId, batchUpdateModel);
    } catch (error) {
      logger.error({ message: 'Error updating batch', error });
    }
  }

  async createInternalBatch(
    name: string,
    cards: string[],
  ): Promise<CreateInternalBatchModelResponse> {
    try {
      logger.debug({ message: 'Creating internal batch' });
      const parsedCards: CardModel[] = await Promise.all(
        cards.map((cardId) => this.cardService.getCardById(cardId)),
      );
      const areCardsValidForBatch = await Promise.all(
        parsedCards.map((card) => this.cardIsValidForBatch(card)),
      );
      const validCards = parsedCards.filter((_, index) => areCardsValidForBatch[index]);

      const batchAttributes: CreateBatchModel = CreateBatchModel.parse({
        name: name,
        type: BatchType.INTERNAL,
        count: validCards.length,
      });
      const batchId = await this.repository.createBatch(batchAttributes);

      for (const card of validCards) {
        let [profile, application] = await this.getProfileAndApplication(card);
        if (application) {
          const batchAttributes: BatchEntryModel = BatchEntryModel.parse({
            batchId: batchId,
            cardNumber: card.cardNumber,
            memberId: card.memberId,
            applicationId: application.applicationId,
          });
          await this.repository.createBatchEntry(batchAttributes);

          await this.cardService.updateCard(card.memberId, card.cardNumber, {
            cardStatus: CardStatus.ADDED_TO_BATCH,
          });
        }
      }
      return { batchId };
    } catch (error) {
      logger.error({ message: 'Error creating internal batch', error });
      throw error;
    }
  }

  async generateExternalBatchesFile(): Promise<void> {
    try {
      logger.debug({ message: 'Creating external batches file' });
      const cardsAwaitingBatching: CardModel[] = await this.cardService.getCardsWithStatus(
        CardStatus.AWAITING_BATCHING,
      );

      const batches: Array<Array<CardModel>> =
        await this.batchCardsValidForPrinting(cardsAwaitingBatching);

      for (const batch of batches) {
        const currentBatchId = await this.createExternalBatch(batch.length);

        const externalCardPrintingData: Array<ExternalCardPrintingDataModel> = [];
        for (const card of batch) {
          let [profile, application] = await this.getProfileAndApplication(card);

          if (profile && application) {
            const batchAttributes: BatchEntryModel = BatchEntryModel.parse({
              batchId: currentBatchId,
              cardNumber: card.cardNumber,
              memberId: card.memberId,
              applicationId: application.applicationId,
            });
            await this.createBatchEntry(batchAttributes);

            await this.cardService.updateCard(card.memberId, card.cardNumber, {
              cardStatus: CardStatus.ADDED_TO_BATCH,
            });

            const cardPrintingData = this.getCardPrintingData(
              currentBatchId,
              card,
              profile,
              application,
            );
            externalCardPrintingData.push(cardPrintingData);
          } else {
            throw new Error('Cannot find profile and application for this card');
          }
        }

        const csvContent = this.convertToCSV(externalCardPrintingData);
        await this.uploadToS3(
          csvContent,
          Bucket.batchFilesBucket.bucketName,
          this.getS3Key(currentBatchId),
          currentBatchId,
        );
      }
    } catch (error) {
      logger.error({ message: 'Error creating external batches', error });
      throw error;
    }
  }

  async uploadBatchFile(s3Record: S3EventRecord): Promise<void> {
    try {
      logger.debug({ message: 'Uploading batch file' });
      const key = s3Record.s3.object.key;
      const bucketName = Bucket.batchFilesBucket.bucketName;
      const file = await this.downloadFileFromS3(bucketName, key);

      await this.uploadFileToSftpServer(file, key);

      const fileName = path.basename(key);
      const batchId = fileName.substring(0, fileName.lastIndexOf('.'));
      await this.updateBatch(batchId, { sentDate: new Date().toISOString() });

      await this.deleteFileFromS3(bucketName, key);
    } catch (error) {
      logger.error({ message: 'Error uploading batch file', error });
      throw error;
    }
  }

  private async downloadFileFromS3(bucketName: string, key: string): Promise<S3.GetObjectOutput> {
    try {
      logger.debug({ message: 'Downloading batch file', key });
      return await this.s3Client
        .getObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();
    } catch (error) {
      logger.error({ message: 'Error downloading file from S3', error });
      throw error;
    }
  }

  private async deleteFileFromS3(bucketName: string, key: string): Promise<void> {
    try {
      logger.debug({ message: 'Deleting batch file', key });
      await this.s3Client
        .deleteObject({
          Bucket: bucketName,
          Key: key,
        })
        .promise();
    } catch (error) {
      logger.error({ message: 'Error deleting file from S3', error });
      throw error;
    }
  }

  private async uploadFileToSftpServer(file: S3.GetObjectOutput, key: string): Promise<void> {
    try {
      logger.debug({ message: 'Uploading batch file to SFTP server' });
      if (Buffer.isBuffer(file.Body)) {
        const fileAsString = this.convertBufferToString(file.Body);

        const sftpClient = new Client();
        sftpClient.ftp.verbose = true;

        await sftpClient.access({
          host: process.env.SFTP_HOST,
          user: process.env.SFTP_USER,
          password: process.env.SFTP_PASSWORD,
          secure: true,
        });

        const fileName = path.basename(key);
        const remotePath = `${process.env.SFTP_PATH_SEND_BATCH_FILE}${fileName}`;

        await sftpClient.uploadFrom(fileAsString, remotePath);
        await sftpClient.close();
      } else {
        throw new Error('Unexpected file type');
      }
    } catch (error) {
      logger.error({ message: 'Error uploading file to SFTP server', error });
      throw error;
    }
  }

  private convertBufferToString(buffer: Buffer): string {
    return buffer.toString('utf-8');
  }

  private async batchCardsValidForPrinting(cards: CardModel[]): Promise<Array<Array<CardModel>>> {
    const batches: Array<Array<CardModel>> = [];
    let currentBatch: CardModel[] = [];

    for (const card of cards) {
      if (await this.cardIsValidForBatch(card)) {
        currentBatch.push(card);
      }

      if (currentBatch.length >= EXTERNAL_BATCH_SIZE_LIMIT) {
        batches.push(currentBatch);
        currentBatch = [];
      }
    }

    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    return batches;
  }

  private async createExternalBatch(batchLength: number): Promise<string> {
    const currentDate = new Date().toISOString();
    const batchName = `batch#${currentDate}`;
    const batchAttributes: CreateBatchModel = CreateBatchModel.parse({
      name: batchName,
      type: BatchType.EXTERNAL,
      count: batchLength,
    });
    return await this.createBatch(batchAttributes);
  }

  private getCardPrintingData(
    batchId: string,
    card: CardModel,
    profile: ProfileModel,
    application: ApplicationModel,
  ): ExternalCardPrintingDataModel {
    return ExternalCardPrintingDataModel.parse({
      memberId: card.memberId,
      cardNumber: card.cardNumber, //should include prefix
      expiryDate: formatDateDDMMYYYY(card.expiryDate),
      firstName: this.cleanData(profile.firstName, false, false),
      lastName: this.cleanData(profile.lastName, false, false),
      address1: this.cleanData(application.address1!, true, false),
      address2: this.cleanData(application.address2 ? application.address2 : '', true, false),
      city: this.cleanData(application.city!, true, false),
      county: this.cleanData(profile.county!, false, false),
      postcode: this.cleanData(application.postcode!, false, true, profile.county),
      batchNumber: batchId,
    });
  }

  private cleanData(
    attribute: string,
    isAddressOrCity: boolean,
    isPostcode: boolean,
    county?: string,
  ): string {
    const regex = isAddressOrCity ? /(\n|^|\r|,)/g : /(\n|\^|\r|)/g;
    let cleanedData = attribute;

    if (isBlcUkBrand() && isPostcode) {
      cleanedData = cleanedData.replace(' ', '');
    }

    if (isBlcAuBrand()) {
      if (isAddressOrCity) {
        cleanedData = this.transformToPascalCase(cleanedData);
      }

      if (isPostcode && county) {
        cleanedData = cleanedData.replace(county, '');
      }
    }

    return cleanedData.replace(regex, '');
  }

  private transformToPascalCase(attribute: string): string {
    return attribute
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private convertToCSV(data: Array<ExternalCardPrintingDataModel>): string {
    const csvLine = data.map((cardPrintingData) => {
      return Object.values(cardPrintingData).join('|');
    });

    // formatted for Windows
    return csvLine.join('\r\n');
  }

  private getS3Key(batchId: string) {
    const fileName = `${batchId}.csv`;
    const mappedBrand = MAP_BRAND[getBrandFromEnv()];
    return `${mappedBrand}/outbound/${fileName}`;
  }

  private async uploadToS3(csvContent: string, bucketName: string, key: string, batchId: string) {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: csvContent,
      ContentType: 'text/csv',
    };

    try {
      logger.debug({ message: 'Uploading batch file', batchId });
      await this.s3Client.upload(params).promise();
    } catch (error) {
      logger.error({ message: 'Error uploading file to S3', error });
      throw error;
    }
  }

  async cardIsValidForBatch(card: CardModel): Promise<boolean> {
    const hasValidName = this.nameIsValid(card);
    const hasValidAddress = await this.addressIsValid(card);

    if (!hasValidName || !hasValidAddress) {
      await this.setPrintingError(card, hasValidName, hasValidAddress);
    }

    return hasValidName && hasValidAddress;
  }

  private nameIsValid = (card: CardModel): boolean =>
    card.nameOnCard.length <= MAX_NAME_ON_CARD_CHARACTER_LIMIT;

  private async addressIsValid(card: CardModel): Promise<boolean> {
    let [profile, applicationForCard] = await this.getProfileAndApplication(card);

    if (profile && applicationForCard) {
      return !!(
        this.fieldNotEmpty(applicationForCard.address1) &&
        this.fieldNotEmpty(applicationForCard.city) &&
        this.fieldNotEmpty(profile.county) &&
        this.fieldNotEmpty(applicationForCard.postcode) &&
        this.fieldNotEmpty(applicationForCard.country)
      );
    } else {
      throw new Error(`Profile or application not found for card number ${card.cardNumber}`);
    }
  }

  private async getProfileAndApplication(
    card: CardModel,
  ): Promise<[ProfileModel, ApplicationModel]> {
    const profile = await this.profileService.getProfile(card.memberId);
    const memberApplications = profile.applications;
    if (memberApplications) {
      const applicationForCard = memberApplications.filter(
        (application) => application.cardNumber === card.cardNumber,
      )[0];
      return [profile, applicationForCard];
    } else {
      throw new Error(`No applications found for member ${card.memberId}`);
    }
  }

  private async setPrintingError(card: CardModel, hasValidName: boolean, hasValidAddress: boolean) {
    let printingErrorStatus: PrintingErrorStatus | undefined = undefined;
    if (!hasValidName && !hasValidAddress) {
      printingErrorStatus = PrintingErrorStatus.MISSING_ADDRESS_AND_NAME_TOO_LONG;
    } else if (!hasValidName) {
      printingErrorStatus = PrintingErrorStatus.NAME_TOO_LONG;
    } else if (!hasValidAddress) {
      printingErrorStatus = PrintingErrorStatus.MISSING_ADDRESS;
    }

    if (printingErrorStatus) {
      await this.cardService.updateCard(card.memberId, card.cardNumber, {
        cardStatus: card.cardStatus,
        printingErrorStatus: printingErrorStatus,
      });
    }
  }

  private fieldNotEmpty = (field: string | undefined) => field && field.trim().length > 0;
}
