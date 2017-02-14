var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './web/js/main.js',
	output: {
		filename: './build/js/bundle.js'
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, "web/js")
				],
				loader: "babel-loader",
			}
		]
	},

	plugins: [
		new CopyWebpackPlugin([
			{context: 'web', from: '**/*', to: 'build/'}
		], {
			ignore: ['*.js']
		})
	]

}
