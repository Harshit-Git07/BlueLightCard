import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { promises as fs } from 'fs'
import { v4 } from 'uuid'
import * as dotenv from 'dotenv'

import mysql from 'mysql2/promise'

//get all the data from the env
dotenv.config({
  path: './src/migrations/.env',
  debug: true,
})

const PRODUCTION_CDN_URL = process.env.PRODUCTION_CDN_URL;
const STAGING_CDN_URL = process.env.STAGING_CDN_URL;
const PRODUCTION_ENV = 'production'

interface RowData {
  id: number;
  name: string;
  start: string;
  end: string;
  status: any;
  link: string;
  bannername: string;
  promotiontype: number;
  cid: number;
}

function validateData (rowData: RowData): { valid: boolean; reason?: string } {
  if (rowData.id === null || rowData.id === undefined) {
    return {
      valid: false,
      reason: 'legacy banner id is null or undefined',
    }
  }
  if (rowData.name === null || rowData.name === undefined || rowData.name === 'GDPR') {
    return {
      valid: false,
      reason: 'banner name is null or undefined',
    }
  }
  if (rowData.end === null || rowData.end === undefined) {
    return {
      valid: false,
      reason: 'expires at is null or undefined',
    }
  }
  if (rowData.start === null || rowData.start === undefined) {
    return {
      valid: false,
      reason: 'startsAt is null or undefined',
    }
  }
  if (rowData.status === null || rowData.status === undefined) {
    return {
      valid: false,
      reason: 'status is null or undefined',
    }
  }
  if (rowData.link === null || rowData.link === undefined) {
    return {
      valid: false,
      reason: 'link is null or undefined',
    }
  }
  if (rowData.bannername === null || rowData.bannername === undefined) {
    return {
      valid: false,
      reason: 'image is null or undefined',
    }
  }
  if (rowData.promotiontype === null || rowData.promotiontype === undefined) {
    return {
      valid: false,
      reason: 'type is null or undefined',
    }
  }
  if (rowData.cid === null || rowData.cid === undefined) {
    return {
      valid: false,
      reason: 'cid is null or undefined',
    }
  }
  return { valid: true }
}

function convertDateUnix (date: string) {

  return new Date(date).getTime() / 1000
}

const brand = process.env.BRAND
const host = process.env.DB_HOST
const port = parseInt(process.env.DB_PORT ?? '3306')
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DATABASE
const region = process.env.REGION ?? 'eu-west-2'
const tableName = process.env.BANNERS_TABLE_NAME
const stage = process.env.STAGE

export async function migrate (): Promise<{ status: string; message: string }> {
  if (host === '' || brand === '' || password === '' || user === '' || tableName === '') {
    return {
      status: 'error ',
      message: 'env variables missing',
    }
  }

  const failedBannersMigration = `logging/Failed-${Date.now().toString()}.txt`
  const skippedVaultLinkMigration = `logging/VaultLinksSkipped-${Date.now().toString()}.txt`
  const skippedAlreadyExistsMigration = `logging/AlreadyExists-${Date.now().toString()}.txt`
  const offsetRecordFile = `logging/Offset-${Date.now().toString()}.txt`
  const successfulBannersFile = `logging/Successful-${Date.now().toString()}.txt`

  let failed = 0
  let successful = 0
  let batchNumber = 0
  let skipped = 0
  const batchSize: number = parseInt(process.env.BATCH_SIZE ?? '50') ?? 50
  let offset: number = parseInt(process.env.OFFSET ?? '0') ?? 0
  // create the connection to database
  const connection = await mysql.createConnection({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database,
  })
  const dynamoClient = new DynamoDBClient({ region: region })
  const dynamodb = DynamoDBDocumentClient.from(dynamoClient)

  const query = `SELECT id, name, start, end, status, link, bannername, promotiontype, cid FROM tblpromotions WHERE status = 1 AND end > NOW() AND promotiontype != 0;`
  const queryTimeStart = new Date().getTime()
  const [result] = await connection.query(query)

  let rows: RowData[] = []
  console.log(`Time taken to run query ${new Date().getTime() - queryTimeStart}ms`)

  if (Array.isArray(result) && result.length > 0) {
    rows = result as RowData[]
  }

  const promises = []

  for (const row of rows) {
    const {
      valid,
      reason
    } = validateData(row)

    if (!valid) {
      await fs.writeFile(failedBannersMigration, `${row.id} - Validation failed: ${reason ?? 'Unknown'}\n`, {
        flag: 'a',
      })
      failed++
      continue
    }

    const bannerUuid: string = v4()

    const params = {
      TableName: tableName,
      Select: 'COUNT',
      KeyConditionExpression:
        'legacyId = :legacyId',
      IndexName: 'legacyId',
      ExpressionAttributeValues: {
        ':legacyId': row.id
      }
    }
    let response
    //check dynamo to see if already migrated
    try {
      const command = new QueryCommand(params)
      response = await dynamodb.send(command)
    } catch (err: any) {
      await fs.writeFile(
        failedBannersMigration,
        `Failed to retrieve existing banner data item from dynamo ${row.id} - ${reason ?? (err as Error).message}}\n`,
        { flag: 'a' },
      )
      failed++
    }

    if (response && response.Count && response.Count > 0) {
      await fs.writeFile(
        skippedAlreadyExistsMigration,
        `Row already exists so skip - ${row.id}\n`,
        { flag: 'a' },
      )
      skipped++
      continue
    }

    //transform data to correct fields
    //convert date to a unix time stamp (some dates are 0000-00-00 00:00:00 and when converting is not a number so set as 0)
    let startDate = isNaN(convertDateUnix(row.start)) ? 0 : convertDateUnix(row.start)
    let endDate = isNaN(convertDateUnix(row.end)) ? 0 : convertDateUnix(row.end)

    if (row.promotiontype === 0 && row.cid === 0) {
      await fs.writeFile(skippedVaultLinkMigration, `${row.id} - ${reason ?? 'Vault link'}\n`, {
        flag: 'a',
      })
      skipped++
      continue
    }
    let promotionType
    let imageLocationPrefix = stage === PRODUCTION_ENV ? PRODUCTION_CDN_URL : STAGING_CDN_URL;
    let companyId = row.cid
    switch (row.promotiontype) {
      case 9:
        promotionType = 'specials'
        break
      case 10:
        //banners on offer details to display
        promotionType = 'takeover'
        imageLocationPrefix += '/complarge/cover/'
        break
      case 11:
        //offer details
        promotionType = 'bottom'
        imageLocationPrefix += '/img/promotion/bottom/'
        break
      case 12:
        promotionType = 'menu'
        imageLocationPrefix += '/img/promotion/menu/'
        break
      case 13:
        //homepage
        promotionType = 'sponsor'
        imageLocationPrefix += '/img/promotion/sponsor/'
        break
      default:
        //promotion type is 0
        //defaulted as this as the following if check doesn't catch as some as they have a company id but no promotion type and must be a string
        promotionType = 'none'
        break
    }

    //check if upgraded banner (company id will be in promotion type and cid will be 0)
    if (row.promotiontype > 13 && row.cid === 0) {
      promotionType = 'upgraded'
      imageLocationPrefix += '/complarge/cover/'
      companyId = row.promotiontype
    }

    //if banner name equals 0 then save as no image
    const imageSource = `${row.bannername}` === '0' ? null : `${imageLocationPrefix}${row.bannername}`
    //if link is equal to 0 then save as no link
    const link = `${row.link}` === '0' ? null : `${row.link}`

    const bannerParams = {
      Item: {
        id: `${bannerUuid}`,
        legacyId: row.id,
        name: `${row.name}`,
        startsAt: isNaN(startDate) ? 0 : startDate,
        expiresAt: isNaN(endDate) ? 0 : endDate,
        status: row.status === 1,
        link: link,
        imageSource: imageSource,
        type: promotionType,
        legacyCompanyId: companyId,
        brand: brand,
      },
      TableName: tableName
    }

    try {
      promises.push(dynamodb.send(new PutCommand(bannerParams)))
      await fs.writeFile(successfulBannersFile, `${row.id}\n`, { flag: 'a' })
      successful++
    } catch (err: any) {
      await fs.writeFile(
        failedBannersMigration,
        `Failed to add banner data item to dynamo ${row.id} - ${reason ?? (err as Error).message}}\n`,
        { flag: 'a' },
      )
      failed++
    }
  }
  // execute Promise.all on promises with a catch on error
  if (promises.length > 0) {
    await Promise.all(promises).catch((error) => {
      console.error(`Failed to add item to banners table ${error as string}`)
    })
  }
  batchNumber++
  offset += batchSize
  await fs.writeFile(offsetRecordFile, offset.toString())
  console.log(`Processed batch ${batchNumber} - successful: ${successful} - current offset: ${offset}`)

  await connection.end()
  const jobEndTime = new Date().getTime()
  const totalTimeTaken = (jobEndTime - queryTimeStart) / 1000
  return {
    status: 'success',
    message: `total successful ${successful}, total failed ${failed}, total skipped ${skipped}, total time taken: ${totalTimeTaken}`,
  }
}

migrate()
  .then((result) => {
    console.log(result)
  })
  .catch((error) => {
    console.log(error)
  })
  .finally(() => {
    process.exit(0)
  })
