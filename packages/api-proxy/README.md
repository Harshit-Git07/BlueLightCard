# API Proxy Cloudflare Worker
This Cloudflare Worker serves as a proxy for forwarding requests to different API Gateway URLs based on the request path.

## Installation
To use this Cloudflare Worker in your project, follow these steps:

**1. Install dependencies:**
```
npm install
```

**2. Run the worker:**
```
npx wrangler dev --var \
    ENVIRONMENT:localhost \
    AUTH_API_BLC_UK:<your-api> \
    AUTH_API_BLC_AU:<your-api> \
    AUTH_API_DDS_UK:<your-api> \
    IDENTITY_API_BLC_UK:<your-api> \
    IDENTITY_API_BLC_AU:<your-api> \
    OFFERS_API_BLC_UK:<your-api> \
    OFFERS_API_BLC_AU:<your-api> \
    OFFERS_API_DDS_UK:<your-api> \
    REDEMPTIONS_API_UK:<your-api> \
    DISCOVERY_API_UK:<your-api> \
```

**3. Set up environment variables (if needed):**
Modify the wrangler.toml file to include the necessary environment variables for your application. You can define environment-specific variables for localhost, staging, and production environments in this file.

**4. Modify the worker logic (if needed):**
Update the src/worker.ts file to customize the proxy logic based on your requirements. This worker currently forwards requests to different API Gateway URLs based on the request path.

## Usage
Once the Cloudflare Worker is running, it will act as a proxy for forwarding requests to different API Gateway URLs based on the request path and envronment variables set. You can use the local worker by sending HTTP requests to the Cloudflare Worker URL.

### For example:

If you run the worker in your localhost environment, you can send requests to http://localhost:58125 -> the port is randomly selected see the console output.

If you deploy the worker to the staging environment, you can send requests to https://staging-api.bluelightcard.workers.dev.

If you deploy the worker to the production environment, you can send requests to https://api.bluelightcard.workers.dev.

## Additional Notes
* You can use Postman to send HTTP requests.
* Ensure that you have set up the appropriate DNS records.
* This worker uses TypeScript for type safety and Wrangler for deployment to the Cloudflare Workers platform.
* You can customize the worker logic and environment variables based on your application's requirements.
* The script `dev-v2` that runs the `wrangler-dev.sh` script is not used yet but will be in V2.

If you encounter any issues or have questions, feel free to reach out to the GitHub CODEOWNERS for assistance.
