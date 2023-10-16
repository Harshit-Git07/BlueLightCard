import { describe, expect, test } from '@jest/globals'
import { handler } from '../../queryLambdaResolver'
import { mockClient } from 'aws-sdk-client-mock'
import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { promises as fs } from 'fs'
import path from 'path'
import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants'
import { ObjectDynamicKeys } from '../types'

const dynamoDbMock = mockClient(DynamoDBDocumentClient)

describe('Test resolveGetOfferMenusByBrandId', () => {
  const ORIGINAL_ENV = process.env
  const JWT_ID_TOKEN: string =
    'eyJraWQiOiIxVXlpR3pQRmZkZTRQYWorK2tUSWhIQ2h5OFVaMkVQejRCNEd5SXZHcTdBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNGE0ZGUxNy1jYThhLTRmNWItOGE0ZC05NTYzMGEzYTM0NGMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMi5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTJfck5tUUVpRlM0IiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiZjRhNGRlMTctY2E4YS00ZjViLThhNGQtOTU2MzBhM2EzNDRjIiwib3JpZ2luX2p0aSI6ImY2ZDljNTI1LTFjYTQtNGQ4NC05ZTI2LTQzOTE1OTQ2NGJhZCIsImF1ZCI6IjQzbXBkMjAxYTVuZXRsbThwY2Jhb3Rpdm9mIiwiZXZlbnRfaWQiOiIzZjdkY2RkMi02MjIwLTRhODktODYzOC03ZTQ0Mjg4Njg5MDkiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5NzAyNTg0MSwiY3VzdG9tOmJsY19vbGRfaWQiOiIyODAwNTk4IiwiY3VzdG9tOmJsY19vbGRfdXVpZCI6IjZkY2ZhODZkLWNkM2QtNGRlNy04MzUwLTYyNTQ4OThkNjM3NCIsInBob25lX251bWJlciI6Iis0NDc3NjkzNTc5OTUiLCJleHAiOjE2OTcwMjk0NDAsImlhdCI6MTY5NzAyNTg0MSwianRpIjoiZmNkODFlMWYtODA0Ni00OGFhLThmOWYtY2RjY2ZhNDc1YTA2IiwiZW1haWwiOiJsdWtlam9obnNvbkBibHVlbGlnaHRjYXJkLmNvLnVrIn0.HC-rjcpzOrf7PtB3rTIHefYqljdfHoId1CCvG7IsSOM8rfn_Fp5DKIvAQGn5j5aEEtfmuNTUi-hA7NkaBEKBTpZc5PGL90I-epG_GsnSEo0fr0bALa0XSuZovgphwFjrm80q7P16ei6YxQ8PN-8Oc80maSjA-6IQ5XoHibxOuYdpnSgeBRxTdNQEm0WM5LA_apmYTbY3DcJx82-Ur47r205jT6VBvPrY4TElEXvaY7HCQzsCNydNiHn3M2EMM7L5Gbh0FkIwGmOdzQIQFZcO4pw82covls-4mcuYWDx7ElA1sxfNUC5XIqeGjeR24X8iupmIToZ8WCFESOOad5mqlg'

  beforeEach(() => {
    dynamoDbMock.reset()
    process.env = { ...ORIGINAL_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = ORIGINAL_ENV // Restore original environment
  })

  it('should fetch the data from DynamoDB', async () => {
    process.env.OFFER_HOMEPAGE_TABLE = 'test-blc-mono-offersHomepage'
    const brandId = 'blc-uk'
    const tableName = process.env.OFFER_HOMEPAGE_TABLE
    const goBackDir = '../../../../../../'

    const dealsOfTheWeek = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'deals.txt'))
    const featuredOffers = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'features.txt'))
    const flexibleMenus = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'flexible.txt'))

    const sliders = await fs.readdir(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'sliders'))

    const marketPlaceMenusMap: ObjectDynamicKeys = {}

    await Promise.all(
      sliders.map(async (file) => {
        const data = await fs.readFile(path.join(__dirname, goBackDir, 'seeds', 'sample-files', 'sliders', file))
        marketPlaceMenusMap[file] = JSON.parse(data.toString())
      }),
    )

    const marketPlaceMenus = JSON.stringify(marketPlaceMenusMap)

    dynamoDbMock
      .on(BatchGetCommand, {
        RequestItems: {
          [tableName]: {
            Keys: [
              {
                id: brandId,
                type: TYPE_KEYS.DEALS
              },
              {
                id: brandId,
                type: TYPE_KEYS.FLEXIBLE
              },
              {
                id: brandId,
                type: TYPE_KEYS.MARKETPLACE
              },
              {
                id: brandId,
                type: TYPE_KEYS.FEATURED
              },
            ],
          },
        },
      })
      .resolves({
        Responses: {
          [tableName]: [
            {
              id: brandId,
              type: TYPE_KEYS.DEALS,
              json: dealsOfTheWeek
            },
            {
              id: brandId,
              type: TYPE_KEYS.FLEXIBLE,
              json: flexibleMenus
            },
            {
              id: brandId,
              type: TYPE_KEYS.MARKETPLACE,
              json: marketPlaceMenus
            },
            {
              id: brandId,
              type: TYPE_KEYS.FEATURED,
              json: featuredOffers
            },
          ],
        },
      })

    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getOfferMenusByBrandId',
        selectionSetList: ['deals', 'features', 'flexible', 'marketPlace'],
      },
      arguments: {
        brandId,
      },
      request: {
        headers: {
          authorization: JWT_ID_TOKEN,
        },
      },
    }

    const result = await handler(event as any)

    expect(result).toHaveProperty('marketPlace')
    expect(result).toHaveProperty('deals')
    expect(result).toHaveProperty('features')
    expect(result).toHaveProperty('flexible')

    expect(result.marketPlace).toHaveLength(11)

    expect(result.marketPlace[0].name).toBe('Holidays & travel')
    expect(result.marketPlace[0].items).not.toBeNull()
    expect(result.marketPlace[0].items.length).toBe(34)
    expect(result.marketPlace[1].name).toBe('New phone deals')
    expect(result.marketPlace[1].items).not.toBeNull()
    expect(result.marketPlace[1].items.length).toBe(13)

    expect(result.deals).not.toBeNull()
    expect(result.deals.length).toBe(13)

    expect(result.features).not.toBeNull()
    expect(result.features.length).toBe(18)

    expect(result.flexible).not.toBeNull()
    expect(result.flexible.length).toBe(12)

    expect(result.flexible[0].items).not.toBeNull()
    expect(result.flexible[0].items.length).toBe(21)
  })

  test('should throw error if brandId is not provided', async () => {
    const event = {
      info: {
        parentTypeName: 'Query',
        fieldName: 'getOfferMenusByBrandId',
        selectionSetList: ['deals', 'features', 'flexible', 'marketPlace'],
      },
      arguments: {},
    }

    await expect(handler(event as any)).rejects.toThrow('brandId is required')
  })
})
