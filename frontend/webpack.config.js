var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: ['whatwg-fetch', './src/index.js'],
    output: {
        path: __dirname + '/dist/',
        filename: 'bundle.js',
        publicPath: '/'
    },

    stats: {
        children: false,
        assets: false
    },

    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css?sourceMap!autoprefixer-loader!less?sourceMap')
            },
            {
                test: /\.(png|svg|gif)$/,
                loader: "url-loader?limit=100000"
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0']
                }
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            title: 'Демо',
        })
    ]
};
