const bootstrapSassAbstractsImports = require('vue-cli-plugin-bootstrap-vue/sassAbstractsImports.js')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
	loaderOptions: {
		sass: {
			additionalData: bootstrapSassAbstractsImports.join('\n')
		},
		scss: {
			additionalData: [...bootstrapSassAbstractsImports, ''].join(';\n')
		}
	}
  },
  devServer: {
	proxy: {
		'/signup':{
			target: 'http://localhost:8000/api/v1/user/signup',
			changeOrigin: true,
			pathRewrite: {'^/signup':''}
		}
	}
  }
})
