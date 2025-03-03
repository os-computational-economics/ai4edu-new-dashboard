/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    //no console logs in prod
    removeConsole: process.env.NODE_ENV == "production",
  },
  redirects() {
    return [
      // When maintenance mode is on, redirect all non-maintenance pages to maintenance
      process.env.MAINTENANCE_MODE === "1"
        ? { source: "/((?!maintenance).*)", destination: "/maintenance", permanent: false }
        : null,
      // When maintenance mode is off, redirect maintenance page to root
      process.env.MAINTENANCE_MODE !== "1"
        ? { source: "/maintenance", destination: "/", permanent: false }
        : null,
    ].filter(Boolean);
  },
};

module.exports = nextConfig;
