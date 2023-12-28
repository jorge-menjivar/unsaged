/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: './out',
  reactStrictMode: true,
  transpilePackages: ["utils"],
  webpack(config, { isServer, dev }) {
    config.experiments = {
      topLevelAwait: true,
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

module.exports = nextConfig;
