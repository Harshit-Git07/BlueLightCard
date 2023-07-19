import {StackContext, Table, use} from 'sst/constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import {Identity} from "@blc-mono/identity/stack";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";

export function Offers({stack}: StackContext) {
    const {cognito} = use(Identity);
    const offersApi = new appsync.GraphqlApi(stack, 'Api', {
        name: `cms-api-${stack.stage}`,
        schema: appsync.SchemaFile.fromAsset('./packages/api/offers/schema.graphql'),
        authorizationConfig: {
            additionalAuthorizationModes: [
                {
                    authorizationType: appsync.AuthorizationType.USER_POOL,
                    userPoolConfig: {
                        userPool: cognito.cdk.userPool,
                    }
                }
            ]
        },
        xrayEnabled: true,
    });

    const brandTable = new Table(stack, 'brandtable', {
        fields: {
            id: 'string',
            homePageId: 'string'
        },
        primaryIndex: {
            partitionKey: 'id'
        },
        globalIndexes: {
            homePageId: {
                partitionKey: 'homePageId',
            },
        },
    })

    const homePageTable = new Table(stack, 'homePageTable', {
        fields: {
            id: 'string'
        },
        primaryIndex: {
            partitionKey: 'id'
        }
    })

    const offersContainerTable = new Table(stack, 'offersContainerTable', {
        fields: {
            id: 'string',
            homePageId: 'string'
        },
        primaryIndex: {
            partitionKey: 'id'
        },
        globalIndexes: {
            homePageId: {
                partitionKey: 'homePageId',
            }
        }
    })

    const offersContainer_offerTable = new Table(stack, 'offersContainerOfferTable', {
        fields: {
            offersContainerId: 'string',
            offerId: 'string'
        },
        primaryIndex: {
            partitionKey: 'offerId',
            sortKey: 'offersContainerId'
        },
        globalIndexes: {
            offersContainerId: {
                partitionKey: 'offersContainerId',
                sortKey: 'offerId'
            }
        }
    });
    const offerTable = new Table(stack, 'offerTable', {
        fields: {
            id: 'string',
        },
        primaryIndex: {
            partitionKey: 'id'
        }
    });

    const companyTable = new Table(stack, 'companyTable', {
        fields: {
            id: 'string',
        },
        primaryIndex: {
            partitionKey: 'id'
        }
    });

    const categoryTable = new Table(stack, 'categoryTable', {
        fields: {
            id: 'string',
        },
        primaryIndex: {
            partitionKey: 'id'
        }
    });

    const offerTypeTable = new Table(stack, 'offerTypeTable', {
        fields: {
            id: 'string',
        },
        primaryIndex: {
            partitionKey: 'id'
        }
    });

    const offers_brandTable = new Table(stack, 'offersBrandTable', {
        fields: {
            offerId: 'string',
            brandId: 'string'
        },
        primaryIndex: {
            partitionKey: 'offerId',
            sortKey: 'brandId'
        },
        globalIndexes: {
            brandId: {
                partitionKey: 'brandId',
                sortKey: 'offerId'
            }
        }
    });

    const offers_categoryTable = new Table(stack, 'offersCategoryTable', {
        fields: {
            offerId: 'string',
            categoryId: 'string'
        },
        primaryIndex: {
            partitionKey: 'offerId',
            sortKey: 'categoryId'
        },
        globalIndexes: {
            categoryId: {
                partitionKey: 'categoryId',
                sortKey: 'offerId'
            }
        }
    });

    const lambdaData = new NodejsFunction(stack, 'resolver', {
        entry: './packages/api/offers/src/resolver.ts',
        handler: 'handler',
        environment: {
            BRAND_TABLE: brandTable.tableName,
            HOMEPAGE_TABLE: homePageTable.tableName,
            OFFERS_CONTAINER_TABLE: offersContainerTable.tableName,
            OFFERS_CONTAINER_OFFER_TABLE: offersContainer_offerTable.tableName,
            OFFER_TABLE: offerTable.tableName,
            OFFER_CATEGORIES_TABLE: offers_categoryTable.tableName,
            CATEGORY_TABLE: categoryTable.tableName,
            OFFER_BRAND_TABLE: offers_brandTable.tableName,
        },
    });
    offersContainer_offerTable.cdk.table.grantReadWriteData(lambdaData);
    offerTable.cdk.table.grantReadWriteData(lambdaData);
    offers_categoryTable.cdk.table.grantReadWriteData(lambdaData);
    offers_brandTable.cdk.table.grantReadWriteData(lambdaData);
    brandTable.cdk.table.grantReadWriteData(lambdaData);
    categoryTable.cdk.table.grantReadWriteData(lambdaData);

    const lambdaDataSource = offersApi.addLambdaDataSource('lambdaDataSource', lambdaData);

    const fields = [
        {typeName: 'OffersContainer', fieldName: 'offers'},
        {typeName: 'Offer', fieldName: 'brands'},
        {typeName: 'Offer', fieldName: 'categories'},
    ];
    fields.forEach(({typeName, fieldName}) =>
        lambdaDataSource.createResolver(`${typeName}${fieldName}Resolver`, {
            typeName,
            fieldName,
        })
    );

    const brandDS = offersApi.addDynamoDbDataSource('brandDataSource', brandTable.cdk.table);
    const homePageDS = offersApi.addDynamoDbDataSource('homePageDataSource', homePageTable.cdk.table);
    const offersContainerDS = offersApi.addDynamoDbDataSource('offersContainerDataSource', offersContainerTable.cdk.table);
    const companyDS = offersApi.addDynamoDbDataSource('companyDataSource', companyTable.cdk.table);
    const offerTypeDS = offersApi.addDynamoDbDataSource('offerTypeDataSource', offerTypeTable.cdk.table);

    brandDS.createResolver('GetHomePagesByBrandID', {
        typeName: 'Query',
        fieldName: 'getBrand',
        requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem('id', 'brandID'),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    homePageDS.createResolver('BrandHomePageResolver', {
        typeName: 'Brand',
        fieldName: 'homePage',
        requestMappingTemplate: appsync.MappingTemplate.fromString(
            `{
                        "version": "2017-02-28",
                        "operation": "GetItem",
                        "key": {
                                "id": $util.dynamodb.toDynamoDBJson($ctx.source.homePageId),
                        }
                    }`
        ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    offersContainerDS.createResolver('HomePageOffersContainersResolver', {
        typeName: 'HomePage',
        fieldName: 'offersContainers',
        requestMappingTemplate: appsync.MappingTemplate.fromString(
            `{"version" : "2017-02-28", "operation" : "Query",  "consistentRead": false, "index" : "homePageId", "query" : {
                    "expression" : "#homePageId = :homePageId",
                    "expressionNames" : {
                        "#homePageId" : "homePageId"
                    },
                    "expressionValues" : {
                        ":homePageId" : $util.dynamodb.toDynamoDBJson($ctx.source.id)
                    }
                }}`
        ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    companyDS.createResolver('OfferCompanyResolver', {
        typeName: 'Offer',
        fieldName: 'company',
        requestMappingTemplate: appsync.MappingTemplate.fromString(
            `{
                        "version": "2017-02-28",
                        "operation": "GetItem",
                        "key": {
                                "id": $util.dynamodb.toDynamoDBJson($ctx.source.companyId),
                        }
                    }`
        ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    offerTypeDS.createResolver('OfferTypeResolver', {
        typeName: 'Offer',
        fieldName: 'offerType',
        requestMappingTemplate: appsync.MappingTemplate.fromString(
            `{
                        "version": "2017-02-28",
                        "operation": "GetItem",
                        "key": {
                                "id": $util.dynamodb.toDynamoDBJson($ctx.source.offerTypeId),
                        }
                    }`
        ),
        responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });
    return {
        offersApi,
    }
}
