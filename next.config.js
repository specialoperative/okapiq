/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    CENSUS_API_KEY: process.env.CENSUS_API_KEY,
    DATAAXLE_PEOPLE_TOKEN: "e65ac1c780a",
    DATAAXLE_PLACES_TOKEN: "a96078c5944",
  },
  // Enable server actions
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
