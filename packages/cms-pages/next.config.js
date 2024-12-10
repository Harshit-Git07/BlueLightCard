const { createClient } = require('next-sanity');
const groq = require('groq');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET_NAME,
  apiVersion: '2024-05-01',
  useCdn: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  swcMinify: true,
  transpilePackages: ['@bluelightcard/shared-ui'],

  async redirects() {
    return await client.fetch(groq`*[_type == 'redirect']{
			source,
			destination,
			permanent
		}`);
  },

  // logging: {
  // 	fetches: {
  // 		fullUrl: true,
  // 	},
  // },
};

module.exports = nextConfig;
