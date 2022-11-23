const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	sassOptions: {
		additionalData: `@import "styles/${process.env.BLC_SITE ?? "blc"}/_variables.scss";`,
	},
}

module.exports = nextConfig
