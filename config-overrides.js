const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const rewireUglifyjs = require('react-app-rewire-uglifyjs');
const path = require('path');
const { updateConfig } = require('react-app-rewire-antd-theme');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackBar = require('webpackbar');

const options = {
	stylesDir: path.join(__dirname, './src/styles'),
	antDir: path.join(__dirname, './node_modules/antd'),
	varFile: path.join(__dirname, './src/styles/variables.less'),
	themeVariables: [
		'@primary-color',
		'@secondary-color',
		'@text-color',
		'@text-color-secondary',
		'@heading-color',
		'@layout-body-background',
		'@btn-primary-bg',
		'@layout-header-background',
		'@bg-color',
		'@font-size-base',
		'@card-background',
		'@icon-color'
	],
	indexFileName: 'index.html',
	generateOnce: true, // generate color.less on each compilation
	mainLessFile: path.join(__dirname, './src/styles/index.less'),
};


module.exports = function override(config, env) {

	mode: 'production',
		(config = injectBabelPlugin(
			[ 'import', { libraryName: 'antd', style: true, javascriptEnabled: true } ],
			config
		));

	config = rewireLess.withLoaderOptions({ 
		javascriptEnabled: true
	})(config, env);

	let alias = (config.resolve.alias || {});
	alias['@ant-design/icons/lib/dist$'] = path.resolve(__dirname, "./src/icon.js");

  config . resolve . alias  = alias;

	config.plugins.push(new WebpackBar());
	config.plugins.push(new BundleAnalyzerPlugin());
	config.plugins.push(new AntDesignThemePlugin(options));
	config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    async: "router-commons",
    children: true,
    deepChildren: true,
    minChunks: 3
  }));
	// config.plugins.push(new webpack.optimize.ModuleConcatenationPlugin({
	// 	async: true, 
	// 	children: true, 
	// 	minChunks: 2,
	// 	filename: "commonlazy.js"
	// }));
	// config.plugins.push(
	// 	new webpack.DefinePlugin({
	// 		'process.env.NODE_ENV': JSON.stringify('production')
	// 	})
	// );
	// config.plugins.push(
	// 	new webpack.optimize.UglifyJsPlugin({
	// 		compress: {
	// 			warnings: false,
	// 			screw_ie8: true,
	// 			conditionals: true,
	// 			unused: true,
	// 			comparisons: true,
	// 			sequences: true,
	// 			dead_code: true,
	// 			evaluate: true,
	// 			if_return: true,
	// 			join_vars: true
	// 		},
	// 		output: {
	// 			comments: false
	// 		}
	// 	})
	// );

	return config;
};
