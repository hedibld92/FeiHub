const { defineConfig } = require('@vue/cli-service')
/** @type {import('@vue/cli-service').ProjectOptions} */
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }
})
