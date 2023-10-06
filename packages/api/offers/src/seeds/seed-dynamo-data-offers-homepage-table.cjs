const fs = require('fs').promises
const path = require('path')

require('dotenv').config()

const AWS = require('aws-sdk')

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION
const TARGET_DYNAMODB_TABLE_NAME = process.env.TARGET_DYNAMODB_TABLE_NAME

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_DEFAULT_REGION
})

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

let marketPlaceMenus = {}
let dealsOfTheWeek
let flexibleMenus
let featuredOffers
let categories
let companies
let popularOffers

async function generateJSON () {
  const files = await fs.readdir(path.join(process.cwd(), 'sample-files', 'sliders'))

  dealsOfTheWeek = await fs.readFile('./sample-files/deals.txt')
  flexibleMenus = await fs.readFile('./sample-files/flexible.txt')
  featuredOffers = await fs.readFile('./sample-files/features.txt')
  categories = await fs.readFile('./sample-files/categories.txt')
  companies = await fs.readFile('./sample-files/compListData.txt')
  popularOffers = await fs.readFile('./sample-files/popularOffersPDO.txt')

  dealsOfTheWeek = dealsOfTheWeek.toString()
  flexibleMenus = flexibleMenus.toString()
  featuredOffers = featuredOffers.toString()
  categories = categories.toString()
  companies = companies.toString()
  popularOffers = popularOffers.toString()

  await Promise.all(
    files.map(async (file) => {
      const data = await fs.readFile(`./sample-files/sliders/${file}`)
      marketPlaceMenus[file] = JSON.parse(data.toString())
    })
  )

  marketPlaceMenus = JSON.stringify(marketPlaceMenus)
}

async function dynamoDBInsert (brand, type, json) {
  const dynamoDBInsertionData =
  {
    id: {
      S: brand
    },
    type: {
      S: type
    },
    json: {
      S: json
    }
  }

  const params = {
    TableName: TARGET_DYNAMODB_TABLE_NAME,
    Item: dynamoDBInsertionData
  }

  // Call DynamoDB to add the item to the table
  ddb.putItem(params, function (err, data) {
    if (err) {
      console.log('DynamoDB Insert Error', err)
    } else {
      console.log('DynamoDB Insert Success', data)
    }
  })
}

(async () => {
  const brand = 'blc-uk'

  await generateJSON()

  await dynamoDBInsert(brand, 'DEALS', dealsOfTheWeek)
  await dynamoDBInsert(brand, 'FLEXIBLE', flexibleMenus)
  await dynamoDBInsert(brand, 'MARKETPLACE', marketPlaceMenus)
  await dynamoDBInsert(brand, 'FEATURED', featuredOffers)
  await dynamoDBInsert(brand, 'POPULAR', popularOffers)
  await dynamoDBInsert(brand, 'CATEGORIES', categories)
  await dynamoDBInsert(brand, 'COMPANIES', companies)
})()
