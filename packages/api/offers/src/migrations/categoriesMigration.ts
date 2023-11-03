import dotenv from 'dotenv';
import { Logger } from '@aws-lambda-powertools/logger';

import { CategoryService } from '../services/categoryService';
import { Category } from '../models/category';
import runSQLQuery from './sql/runSQLQuery'
import selectTblCatsQuery from './sql/queries/selectTblCatsQuery';
import selectTblBusinessCatsQuery from './sql/queries/selectTblBusinessCatsQuery';
import { CATEGORY_TYPES } from 'src/utils/global-constants';
import getValidCategoriesReducer from './validation/getValidCategoriesReducer';

dotenv.config({
    path: '.env',
    debug: true,
})

const categoryTableName = process.env.CATEGORY_TABLE_NAME;

if (!categoryTableName) {
    throw new Error('No target table name specified');
}

const logger = new Logger({ serviceName: 'categories-migration' });
const categoryService = new CategoryService(categoryTableName, logger);

const migrateCategories = async (query: string, type: string) => {
    const validCategoriesReducer = getValidCategoriesReducer(logger)
    
    const categories: Category[] = 
        (await runSQLQuery(query, logger) as Category[])
        .reduce(validCategoriesReducer, []);

    logger.info(`-- INSERTING ${categories.length} ${type} CATEGORIES INTO ${categoryTableName} --`)
        
    await categoryService.createCategoriesIfNotExists(categories);
        
    logger.info(`-- FINISHED INSERTING ${type} CATEGORIES --`)
}

const runMigration = async () => {
    const promiseQueries = [
        migrateCategories(selectTblBusinessCatsQuery, CATEGORY_TYPES.COMPANY.toUpperCase()),
        migrateCategories(selectTblCatsQuery, CATEGORY_TYPES.OFFER.toUpperCase()),
    ];

    await Promise.all(promiseQueries);

    process.exit();
}

runMigration();