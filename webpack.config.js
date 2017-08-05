var webpack = require('webpack');
path = require('path');

const javascriptLoader = {
	test: /\.js$/,
	exclude: /node_modules/,
	loader: 'babel-loader',
};

const htmlLoader = {
	test: /\.html$/,
	exclude: /node_modules/,
	loader: 'html-loader',
};

const cssLoader = {          
	test: /\.scss$/,
	exclude: /node_modules/,
	loader: 'style-loader!css-loader!sass-loader'     
};

const urlLoader = {
	test: /\.(png|woff|woff2|eot|ttf|svg)$/, 
	exclude: /node_modules/,
	loader: 'url-loader'
};

module.exports = {
	entry: path.join(__dirname, 'public', 'javascripts', 'app.js'),
	output: {
		path: path.join(__dirname, 'public', 'javascripts'),
		filename: 'app.bundle.js'
	},

	module: {
		loaders: [javascriptLoader, htmlLoader, cssLoader, urlLoader],
	},

     devtool: 'source-map',
 };