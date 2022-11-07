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
		},
		'/signin':{
			target: 'http://localhost:8000/api/v1/user/signin',
			changeOrigin: true,
			pathRewrite: {'^/signin':''}
		},
		'/home':{
			target: 'http://localhost:8000/api/v1/user/home',
			changeOrigin: true,
			pathRewrite: {'^/home':''}
		},
		'upload': {
			target: 'http://localhost:8000/api/v1/user/upload',
			changeOrigin: true,
			pathRewrite: {'^/upload':''}
		},
		'/logout':{
			target: 'http://localhost:8000/api/v1/user/logout',
			changeOrigin: true,
			pathRewrite: {'^/logout':''}
		},
	}
  }
})
