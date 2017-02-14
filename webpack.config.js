var path = require('path');

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
	}

}
