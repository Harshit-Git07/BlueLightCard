import {AppSyncResolverEvent} from "aws-lambda";
import { DynamoDBDocumentClient, QueryCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Logger } from '@aws-lambda-powertools/logger'
const logger = new Logger({ serviceName: `lambdaResolver` })

const offersContainerOfferTable = process.env.OFFERS_CONTAINER_OFFER_TABLE  as string;
const brandTable = process.env.BRAND_TABLE  as string;
const offerCategoryTable = process.env.OFFER_CATEGORIES_TABLE  as string;
const offerBrandTable = process.env.OFFER_BRAND_TABLE  as string;
const offerTable: string = process.env.OFFER_TABLE as string;
const categoryTable: string = process.env.CATEGORY_TABLE as string;
const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

async function resolveOffersContainerOffers(event: AppSyncResolverEvent<any>) {
    const containerId = event.source?.id; // Get the ID of the OffersContainer

    // Step 1: Fetch offer IDs from the many-to-many table
    const manyToManyTableParams = {
        TableName: offersContainerOfferTable,
        KeyConditionExpression: 'offersContainerId = :offersContainerId',
        ExpressionAttributeValues: {
            ':offersContainerId': containerId,
        },
        IndexName: 'offersContainerId'
    };

    const result = await dynamodb.send(new QueryCommand(manyToManyTableParams));
    if (result.Items === null || (result.Items != null && result.Items.length === 0)) {
        return [];
    }
    const offerIds = result.Items?.map((item) => item.offerId);

    if (!offerIds) {
        return [];
    }

    // Step 2: Fetch the corresponding offers from the offer table
    const offerTableParams = {
        RequestItems: {
            [offerTable]: {
                Keys: offerIds.map((id) => ({ id })),
            }
        },
    };

    const offerData = await dynamodb.send( new BatchGetCommand(offerTableParams));
    if (!offerData.Responses) {
        return [];
    }

    const offers = offerData.Responses[`${offerTable}`];
    logger.info('offerData', { offers });

    return {
        items: offers
    };
}

async function resolveOffersCategories(event: AppSyncResolverEvent<any>) {
    const offerId = event.source?.id; // Get the ID of the Offer

    // Step 1: Fetch offer IDs from the many-to-many table
    const manyToManyTableParams = {
        TableName: offerCategoryTable,
        KeyConditionExpression: 'offerId = :offerId',
        ExpressionAttributeValues: {
            ':offerId': offerId,
        },
    };

    const result = await dynamodb.send(new QueryCommand(manyToManyTableParams));
    if (result.Items === null || (result.Items != null && result.Items.length === 0)) {
        return [];
    }
    const categoryIds = result.Items?.map((item) => item.categoryId);

    if (!categoryIds) {
        return [];
    }

    // Step 2: Fetch the corresponding offers from the offer table
    const categoryTableParams = {
        RequestItems: {
            [categoryTable]: {
                Keys: categoryIds.map((id) => ({ id })),
            }
        },
    };

    const categoryData = await dynamodb.send( new BatchGetCommand(categoryTableParams));
    if (!categoryData.Responses) {
        return [];
    }

    const categories = categoryData.Responses[`${categoryTable}`];
    logger.info('categoriesData', { categories });

    return {
        items: categories
    };
}
async function resolveOffersBrands(event: AppSyncResolverEvent<any>) {
    const offerId = event.source?.id; // Get the ID of the Offer

    // Step 1: Fetch offer IDs from the many-to-many table
    const manyToManyTableParams = {
        TableName: offerBrandTable,
        KeyConditionExpression: 'offerId = :offerId',
        ExpressionAttributeValues: {
            ':offerId': offerId,
        },
    };

    const result = await dynamodb.send(new QueryCommand(manyToManyTableParams));
    if (result.Items === null || (result.Items != null && result.Items.length === 0)) {
        return [];
    }
    const brandIds = result.Items?.map((item) => item.brandId);

    if (!brandIds) {
        return [];
    }

    // Step 2: Fetch the corresponding offers from the offer table
    const brandTableParams = {
        RequestItems: {
            [brandTable]: {
                Keys: brandIds.map((id) => ({ id })),
            }
        },
    };

    const brandData = await dynamodb.send( new BatchGetCommand(brandTableParams));
    if (!brandData.Responses) {
        return [];
    }

    const brands = brandData.Responses[`${brandTable}`];
    logger.info('categoriesData', { brands });

    return {
        items: brands
    };
}

export const handler = async(event: AppSyncResolverEvent<any>) => {

    if (event.info.fieldName === 'offers' && event.info.parentTypeName === 'OffersContainer') {
        return await resolveOffersContainerOffers(event);
    }
    if (event.info.fieldName === 'categories' && event.info.parentTypeName === 'Offer') {
        return await resolveOffersCategories(event);
    }
    if (event.info.fieldName === 'brands' && event.info.parentTypeName === 'Offer') {
        return await resolveOffersBrands(event);
    }

};
