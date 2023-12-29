/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
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
  transpilePackages: ["utils", "ui"]
};

module.exports = nextConfig;
