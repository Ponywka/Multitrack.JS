const path = require('path')
const webpack = require('webpack')

module.exports = {
	mode: 'production',
	module: {
		rules: [{
			test: /\.s[ac]ss$/i,
			use: [
				'style-loader',
				'css-loader',
				'sass-loader'
			]
		}, {
			test: /\.m?js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader'
			}
		}]
	},
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'MultitrackJS'
	},
	plugins: [new webpack.DefinePlugin({
		__TIMESTAMP__: JSON.stringify(new Date().getTime())
	})],
}
