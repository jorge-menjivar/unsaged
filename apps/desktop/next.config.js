/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_PUBLIC_TAURI ? 'export' : 'standalone',
  distDir: './out',
  reactStrictMode: true,
  webpack(config, { isServer, dev }) {
    config.experiments = {
      topLevelAwait: true,
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
  transpilePackages: ["utils"]
};

module.exports = nextConfig;
