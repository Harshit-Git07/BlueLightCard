const { BRAND } = require("./global-vars");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    trailingSlash: true,
    images: {
        unoptimized: true,
    },
    sassOptions: {
        additionalData: `@import "brands/${BRAND}/variables.scss";`
    }
};

module.exports = nextConfig;
