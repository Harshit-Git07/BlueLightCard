import axios from 'axios';
import Chance from 'chance';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env files
const envFile = process.env.NODE_ENV === 'staging' ? '.env.staging' : '.env.live';
dotenv.config({ path: path.resolve(__dirname, envFile) });

export interface EmailDetails {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
  html: string;
}

export class EmailUtil {
  private static TESTMAIL_APIKEY = '0a492c84-a598-4ef5-bbc2-a68074555773';
  private static TESTMAIL_NAMESPACE = 'ecc9z';
  private static ENDPOINT = `https://api.testmail.app/api/json?apikey=${EmailUtil.TESTMAIL_APIKEY}&namespace=${EmailUtil.TESTMAIL_NAMESPACE}`;
  private static chance = new Chance();

  static generateTag(): string {
    return this.chance.string({
      length: 12,
      pool: 'abcdefghijklmnopqrstuvwxyz0123456789',
    });
  }

  static getTestEmail(tag: string): string {
    return `${this.TESTMAIL_NAMESPACE}.${tag}@inbox.testmail.app`;
  }

  static async fetchInbox(
    tag: string,
  ): Promise<{ result: string; count: number; emails: EmailDetails[] }> {
    try {
      const response = await axios.get(`${this.ENDPOINT}&tag=${tag}&livequery=true`);
      return response.data;
    } catch (err) {
      throw new Error(`Error fetching inbox: ${err.message}`);
    }
  }

  // Function to extract href values containing a keyword
  static extractHrefContainingKeyword(html: string, keyword: string): string[] {
    const hrefPattern = /href="([^"]*)"/gi;
    const matchingUrls: string[] = [];
    let match: RegExpExecArray | null;

    // Use the regular expression to find all href attributes
    while ((match = hrefPattern.exec(html)) !== null) {
      const url = match[1];
      // Check if the URL contains the specified keyword
      if (url.includes(keyword)) {
        matchingUrls.push(url);
      }
    }

    return matchingUrls;
  }

  // Function to replace domain in a URL
  static replaceDomain(url: string, oldDomain: string, newDomain: string): string {
    // Create a regular expression to match the old domain
    const regex = new RegExp(oldDomain, 'g');
    // Replace occurrences of the old domain with the new domain
    return url.replace(regex, newDomain);
  }

  static async setupAndValidateEmails(emailTag: string): Promise<void> {
    const keyword = 'validate';
    const testEmail = this.getTestEmail(emailTag);

    // Fetch inbox
    const inbox = await this.fetchInbox(emailTag);

    // Validate inbox result
    if (inbox.result !== 'success') {
      throw new Error('Inbox result is not success');
    }

    //TODO - Change this to one when generating a random email address
    if (inbox.count !== 2) {
      throw new Error('Expected 2 emails in the inbox');
    }

    // Extract href values containing the keyword
    const filteredLinks = this.extractHrefContainingKeyword(inbox.emails[0].html, keyword);

    if (filteredLinks.length > 0) {
      filteredLinks.forEach((link) => {
        console.log(`Verification link: ${link}`);

        // Check if the environment is staging
        if (process.env.ENVIRONMENT === 'staging') {
          const updatedUrl = this.replaceDomain(
            link,
            'www.bluelightcard.co.uk',
            'www.staging.bluelightcard.co.uk',
          );
          // Output the result to the console
          console.log(`Updated URL: ${updatedUrl}`);
        }
      });
    } else {
      throw new Error('Verification link containing the keyword not found');
    }
  }
}

// Utility function to generate a random email address
export function generateRandomEmail(length: number): string {
  // Validate the length parameter
  if (length <= 0) {
    throw new Error('Length must be a positive number');
  }

  // Generate a random string of the specified length
  const randomPart = this.chance.string({
    length,
    pool: 'abcdefghijklmnopqrstuvwxyz0123456789',
  });

  // Construct the email address
  const emailAddress = `ecc9z.${randomPart}@inbox.testmail.app`;

  return emailAddress;
}
