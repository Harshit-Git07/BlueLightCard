import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env files
const envFile = process.env.NODE_ENV === 'staging' ? '.env.staging' : '.env.production';
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
  private static ENDPOINT = `https://api.testmail.app/api/json?apikey=${process.env.TESTMAIL_APIKEY}&namespace=${process.env.TESTMAIL_NAMESPACE}`;

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

  static extractHrefContainingKeyword(html: string, keyword: string): string {
    const hrefPattern = /href="([^"]*)"/gi;
    const matchingUrls: string[] = [];
    let match: RegExpExecArray | null;

    // Use the regular expression to find all href attributes
    while ((match = hrefPattern.exec(html)) !== null) {
      const url = match[1];
      if (url.includes(keyword)) {
        matchingUrls.push(url);
        // If more than one URL is found, throw an error
        if (matchingUrls.length > 1) {
          throw new Error(`Multiple URLs found containing the keyword "${keyword}".`);
        }
      }
    }
    return matchingUrls[0];
  }

  static async returnEmailValidationLink(email: string): Promise<string> {
    const fullEmail = email;

    // Define the regular expression to extract the email tag (randomPart)
    const regex = new RegExp(`${process.env.TESTMAIL_NAMESPACE}\\.(.*?)@inbox\\.testmail\\.app`);

    // Execute the regex on the email string to extract the email tag
    const match = fullEmail.match(regex);

    let emailTag: string;
    if (match && match[1]) {
      emailTag = match[1];
      console.log(`Extracted email tag: ${emailTag}`); // Outputs the extracted email tag
    } else {
      throw new Error('Invalid email format or email tag not found');
    }

    // Fetch the inbox for the generated email tag
    const inbox = await this.fetchInbox(emailTag);

    // Validate the result of the inbox fetch operation
    if (inbox.result !== 'success') {
      throw new Error('Inbox fetch has failed');
    }

    // Ensure there is exactly one email in the inbox
    if (inbox.count !== 1) {
      throw new Error(`Expected 1 email in the inbox, but found ${inbox.count}.`);
    }

    // Extract a single href value containing the keyword from the email HTML content
    const verificationLink = this.extractHrefContainingKeyword(inbox.emails[0].html, 'validate');

    // Check if a link containing the keyword was found and return it
    if (verificationLink) {
      console.log(`Verification link: ${verificationLink}`);
      return verificationLink;
    } else {
      throw new Error('Verification link containing the keyword not found');
    }
  }
}
