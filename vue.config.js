const path = require('path')
const devMode = process.env.NODE_ENV === 'development';

module.exports = {
  devServer: {
    disableHostCheck: true
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'PS2Alerts'
        args[0].baseUrl = process.env.VUE_APP_BASE_URL ? process.env.VUE_APP_BASE_URL : 'http://dev.ps2alerts.com'
        args[0].description = "PS2Alerts - Building Planetside 2's Alert metagame"
        return args
      })
  },
  configureWebpack: {
    mode: devMode ? 'development' : 'production',
    entry: path.resolve(__dirname, 'src/main.ts'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: devMode ? '[name].js' : '[name].[contenthash].js',
      chunkFilename: devMode ? '[name].js' : '[name].[contenthash].js',
    },
    optimization: {
      moduleIds: 'hashed',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
  }
}
