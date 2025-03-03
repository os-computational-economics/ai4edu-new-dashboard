/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    //no console logs in prod
    removeConsole: process.env.NODE_ENV == "production",
  },
  redirects() {
    return [
      process.env.MAINTENANCE_MODE === "1"
        ? { source: "/((?!maintenance).*)", destination: "/maintenance", permanent: false }
        : null,
    ].filter(Boolean);
  },
};

module.exports = nextConfig;
