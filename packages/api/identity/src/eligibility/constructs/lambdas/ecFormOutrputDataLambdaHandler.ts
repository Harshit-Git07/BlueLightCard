import { Logger } from "@aws-lambda-powertools/logger";
import { AttributeValue, DynamoDB, ScanCommandInput, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';
import AWS from "aws-sdk";
import nodemailer from "nodemailer";

const ecFormOutputDataRecipients = process.env.EC_FORM_OUTPUT_DATA_REPORT_RECEIPIENTS !== undefined ? process.env.EC_FORM_OUTPUT_DATA_REPORT_RECEIPIENTS : '{}';

const AWS_REGION = process.env.REGION ?? "eu-west-2";
const LAMBDA_LOCAL_FILE_NAME = 'Eligibility_Report' + new Date().toString() + '.csv';
const EMAIL_RECIPIENTS = JSON.parse(ecFormOutputDataRecipients)
const SHOULD_CLEAR_DYNAMODB: boolean = false;
const BUCKET_NAME = process.env.S3_BUCKET_NAME ?? "";
const DYNAMODB_TABLE_NAME = process.env.EC_FORM_OUTPUT_DATA_TABLE ?? "";

const ddb = new DynamoDB({ region: AWS_REGION });
const docClient = new AWS.DynamoDB.DocumentClient();
const logger = new Logger({ serviceName: `ecFormOutrputDataLambdaHandler` });

export const handler = async (event: any) => {
  logger.info("event", { event });

  let tableData = await scanTable(DYNAMODB_TABLE_NAME);
  const unmarshalled = tableData.map((i) => unmarshall(i));
  let csv = JsonToCSV(unmarshalled);

  await Promise.all([scheduledEmail(csv), uploadFileOnS3(csv), clearDataFromDatabase(unmarshalled)]);

  return {
    statusCode: 200,
    body: "done"
  }   
}

export async function scanTable(tableName: string): Promise<Record<string, AttributeValue>[]> {
  const params: ScanCommandInput = {
      TableName: tableName
  };

  const scanResults: Record<string, AttributeValue>[] = [];
  let items: ScanCommandOutput;
  do {
    items =  await ddb.scan(params);
    items.Items?.forEach((item) => scanResults.push(item));
    params.ExclusiveStartKey  = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== "undefined");

  return scanResults;
};


function JsonToCSV(data: Record<string, any>){
  const JsonFields = ["Organisation","Job Role","Employment Status","Employer", "Date & Time"]

  var csvStr = JsonFields.join(",") + "\n";

  data.forEach((formData: ecFormData) => {
    let organisation      = formData.organisation;
    let jobRole           = formData.jobRole;
    let employmentStatus  = formData.employmentStatus
    let employer          = formData.employer
    let dateTime          = convertTimeStampToDateTime(parseInt(formData.dateTime));
    csvStr += organisation + ',' + jobRole + ','  + employmentStatus + ',' + employer + ','  + dateTime + "\n";
  })

  return csvStr;
}

async function scheduledEmail (csvContent: string) {
  var mailOptions = {
    from: EMAIL_RECIPIENTS[0],
    subject: 'Eligibility Checker Weekly Report',
    html: 
      `
        <html>
        <head></head>
        <body>
        <h1>Hello!</h1>
        <p>Please find the attached file containing the weekly report of Eligibility Checker form output.</p>
        </body>
        </html> 
      `,
    to: EMAIL_RECIPIENTS,
    attachments: [
      {
        filename: LAMBDA_LOCAL_FILE_NAME,
        content: csvContent
      }
    ]
};

// create Nodemailer SES transporter
var transporter = nodemailer.createTransport({
    SES: new AWS.SES({region: AWS_REGION, apiVersion: "2010-12-01"})
});

// send email
return new Promise((resolve, reject) => {
  transporter.sendMail(mailOptions, function (err: any, info: any){
    if (err) {
      console.error(err);
      console.error('Error sending email');
    } else {
        console.log('Email sent successfully');
    }
  })
})

}

async function uploadFileOnS3(fileData: any){
  console.log("Starting S3 file upload")

  var s3 = new AWS.S3({region: AWS_REGION})

  var params = {
      Bucket : BUCKET_NAME,
      Key : LAMBDA_LOCAL_FILE_NAME,
      Body : fileData
  }
  return new Promise((resolve, reject) => {
    try {
      s3.putObject(params, (err, results) => {
        if (err) reject(err);
        else {
          console.log(results);
          const body = results;
          resolve(results)
        }
      });
    } catch (err) {
      logger.info(err + "");
      console.error("Unable to upload the file on S3")
      const statusCode = 400;
      return err;
    }
  });
}

async function clearDataFromDatabase(tableData: any) {
  if(SHOULD_CLEAR_DYNAMODB) {
    try {
      // delete item one by one 
      for (const item of tableData) {
        console.log(tableData);
        await deleteItem(item.pk, item.sk);
      }
      console.log("All records successfully deleted from database");
    } catch (e) {
      console.log("Unable to delete record from database");
    }
  }
}

const deleteItem = (pk: string, sk: string) => {
  var params = {
    TableName: DYNAMODB_TABLE_NAME,
    Key: {
      pk: pk,
      sk: sk,
    },
  };

  return new Promise<void>(function (resolve, reject) {
    docClient.delete(params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export function convertTimeStampToDateTime(timeStamp: number) {
  let date = '';
  try {
    date = new Date(timeStamp).toISOString().substring(0,19).replace('T', ' ');

  } catch (e) {
    console.log("Error converting timestamp: " + timeStamp, e);
  }

  return date;
}

export type ecFormData = {
  organisation: string;
  jobRole: string;
  employmentStatus: boolean;
  employer: string;
  dateTime: string;
};
