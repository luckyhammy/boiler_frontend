module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.ignoreWarnings = [
        {
          module: /stylis-plugin-rtl/,
          message: /Failed to parse source map/,
        },
      ];
      return webpackConfig;
    },
  },
  devServer: {
    allowedHosts: 'all',
  },
};