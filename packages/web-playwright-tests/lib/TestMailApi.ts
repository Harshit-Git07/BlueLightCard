interface EmailDetails {
    id: string;
    subject: string;
    from: string;
    to: string;
    date: string;
    body: string;
}

export class TestMailApi {
    private apiUrl: string;
    private apiKey: string;

    constructor(apiUrl: string, apiKey: string) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    private async fetchFromApi(endpoint: string): Promise<any> {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`${this.apiUrl}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        return response.json();
    }

    async getEmailDetails(emailId: string): Promise<EmailDetails> {
        const endpoint = `/emails/${emailId}`;
        const data = await this.fetchFromApi(endpoint);
        return {
            id: data.id,
            subject: data.subject,
            from: data.from,
            to: data.to,
            date: data.date,
            body: data.body
        };
    }

    async getEmailsByRecipient(emailAddress: string): Promise<EmailDetails[]> {
        const endpoint = `/emails?recipient=${encodeURIComponent(emailAddress)}`;
        const data = await this.fetchFromApi(endpoint);
        return data.emails.map((email: any) => ({
            id: email.id,
            subject: email.subject,
            from: email.from,
            to: email.to,
            date: email.date,
            body: email.body
        }));
    }
}


class TestMailService {
    private api: TestMailApi;

    constructor(api: TestMailApi) {
        this.api = api;
    }

    async runExample(emailAddress: string): Promise<void> {
        try {
            const emails = await this.api.getEmailsByRecipient(emailAddress);
            console.log(`Received emails for ${emailAddress}:`, emails);

            if (emails.length > 0) {
                const emailDetails = await this.api.getEmailDetails(emails[0].id);
                console.log('Details of first email:', emailDetails);
            }
        } catch (error) {
            console.error('Error fetching emails:', error);
        }
    }
}

// Example:
// const apiUrl = 'https://api.testmail.app/api';  // Adjust this to the correct TestMail.app API URL
// const apiKey = 'your-api-key-here';

// const testMailApi = new TestMailApi(apiUrl, apiKey);
// const testMailService = new TestMailService(testMailApi);

// const emailAddress = 'recipient@example.com';
// testMailService.runExample(emailAddress);