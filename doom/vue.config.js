const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
        proxy: {
            '/api': {
                target: `http://127.0.0.1:8000/api`,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
  "lintOnSave": false,
  publicPath: '/',
  assetsDir: 'static',
  chainWebpack: config => {
    config.module
      .rule('images')
        .set('parser', {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 4KiB
          }
        })
  }

  }
)
