/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    //no console logs in prod
    removeConsole: process.env.NODE_ENV == "production"
  }
};

module.exports = nextConfig;
