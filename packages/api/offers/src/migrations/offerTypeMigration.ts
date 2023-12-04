import dotenv from 'dotenv';
import { Logger } from '@aws-lambda-powertools/logger';
import { OfferTypeService } from '../services/offerTypeService';
import getValidOfferTypeReducer from './validation/getValidOfferTypeReducer';
import { OfferType } from '../models/offerType';
import runSQLQuery from './sql/runSQLQuery';
import selectTblOfferTypeQuery from './sql/queries/selectTblOfferTypeQuery';

dotenv.config({
  path: '.env',
  debug: true,
});

const offerTypeTableName = process.env.OFFERTYPE_TABLE_NAME;

if (!offerTypeTableName) {
  throw new Error('No target table name specified');
}

const logger = new Logger({ serviceName: 'offerType-migration' });
const offerTypeService = new OfferTypeService(offerTypeTableName, logger);

const migrateOfferTypes = async () => {
  const validOfferTypesReducer = getValidOfferTypeReducer(logger);

  const offerTypesLegacy: OfferType[] = ((await runSQLQuery(selectTblOfferTypeQuery, logger)) as OfferType[]).reduce(
    validOfferTypesReducer,
    [],
  );

  const legacyIds = offerTypesLegacy.map((offerType) => offerType.legacyId);

  if (legacyIds && legacyIds.length === 0) {
    throw new Error('No offer types found');
  }

  const offerTypesModern = await offerTypeService.batchQueryByLegacyIds(legacyIds as number[]);

  const offerTypesToInsert = offerTypesLegacy.filter((offerType) => {
    const offerTypeModern = offerTypesModern.find((offerTypeModern) => {
      if (offerTypeModern && offerTypeModern.Items && offerTypeModern.Items.length > 0) {
        return offerTypeModern.Items[0].legacyId === offerType.legacyId;
      } else {
        return false;
      }
    });
    return !offerTypeModern;
  });

  logger.info(`-- INSERTING ${offerTypesToInsert.length} OFFER TYPES INTO ${offerTypeTableName} --`);

  if (offerTypesToInsert.length > 0) {
    await offerTypeService.batchWrite(offerTypesToInsert);
  }

  logger.info(`-- FINISHED INSERTING OFFER TYPES --`);
};

const runMigration = async () => {
  await migrateOfferTypes();

  process.exit();
};

runMigration();
