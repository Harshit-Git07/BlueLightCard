import dotenv from 'dotenv';
import { Logger } from '@aws-lambda-powertools/logger';

import { CompanyService } from 'src/services/companyService';
import { Company } from 'src/models/company';
import getValidCompaniesReducer from './validation/getValidCompaniesReducer';

import runSQLQuery from './sql/runSQLQuery';
import selectCountQuery from './sql/queries/selectCountQuery';
import selectTblCompaniesQuery from './sql/queries/selectTblCompaniesQuery';

dotenv.config({
	path: '.env',
	debug: true,
});

const QUERY_LIMIT = 1000;
const COMPANY_TABLE_NAME = process.env.COMPANY_TABLE_NAME;
const SQL_TABLE_NAME = 'tblcompanies';

if(!COMPANY_TABLE_NAME) {
	throw new Error('No target table name specified');
}

const logger = new Logger({ serviceName: 'companies-migration' });
const companyService = new CompanyService(COMPANY_TABLE_NAME, logger);

const migrateCompanies = async () => {
	const validCompaniesReducer = getValidCompaniesReducer(logger);
	
	const totalCountQuery = selectCountQuery(SQL_TABLE_NAME);
	const { count } = (await runSQLQuery(totalCountQuery, logger))[0] as { count: number };
	logger.info(`-- Total Count of Companies: ${count} --`);
	const iterationCount = Math.ceil(count / QUERY_LIMIT);
	logger.info(`-- Total number of fetch iteration required: ${iterationCount} --`);

	//Initialise
	let offset = 0;
	const batchWriteSize = 25;

	for (let i = 1; i <= iterationCount; i++) {
		let newCompaniesCount = 0;
		let existingCompaniesCount = 0;
		let fetchedCompanies: Company[] = [];
		let allCompaniesToInsert: Company[][] = [];
		logger.info(`-- Fetch iteration ${i} of ${iterationCount} FROM ${COMPANY_TABLE_NAME} with OFFSET ${offset} started --`);
		const query = selectTblCompaniesQuery(SQL_TABLE_NAME, QUERY_LIMIT, offset);
		fetchedCompanies = ((await runSQLQuery(query, logger)) as Company[]).reduce(validCompaniesReducer, []);
		offset += QUERY_LIMIT;
		const batchIterations = Math.ceil(fetchedCompanies.length / batchWriteSize);


		for (let i = 0; i < batchIterations; i++) {	
			logger.info(`-- Write Iteration ${i + 1} of ${batchIterations} --`);
			
			const companyBatches = fetchedCompanies.slice(i * batchWriteSize, (i + 1) * batchWriteSize);
			const companiesModern = await companyService.batchQueryByLegacyIds(companyBatches.map((company) => company.legacyId!));
			
			const companyToInsert = companyBatches.filter((companyLegacy) => {
				const modernCompany = companiesModern.find((company) => {
					if(company && company.Items && company.Items.length > 0) {
						const isExists = company.Items[0].legacyId === companyLegacy.legacyId;
						if(isExists) {
							existingCompaniesCount++;
						}
						return isExists;
					} else {
						return false;
					}
				});
				return !modernCompany;
			})

			 if(companyToInsert.length > 0) {
			 	newCompaniesCount += companyToInsert.length;
			 	allCompaniesToInsert.push(companyToInsert);
			 }
		}
		
		await promiseAll(allCompaniesToInsert);

		logger.info(`-- Fetch iteration ${i}, ${newCompaniesCount} new companies, Inserted in DynamoDB --`);
		logger.info(`-- Fetch iteration ${i}, ${existingCompaniesCount} companies already exist in DynamoDB --`);
		logger.info(`-- FETCHING ${QUERY_LIMIT} NEW COMPANIES FROM ${SQL_TABLE_NAME} finished --`);
	}
}

async function promiseAll(allCompaniesToInsert: Company[][]) {
	if(allCompaniesToInsert.length > 0) {
		const promises = allCompaniesToInsert.map((companies) => {
			return new Promise((resolve,) => {
				setTimeout(resolve, 100);
			}).then(() => {
				return companyService.batchWrite(companies);
			})
		})
		try {
			await Promise.all(promises);
		}catch (error: any) {
			logger.error('error batch writing', error);
		}
	}
}

const runMigration = async () => {
	logger.info(`STARTING ${COMPANY_TABLE_NAME} MIGRATION`);
	await migrateCompanies();
  logger.info(`FINISHED ${COMPANY_TABLE_NAME} MIGRATION`);
  process.exit();
}

runMigration();