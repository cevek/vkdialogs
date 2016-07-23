var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var wpConfig = require('./webpack.config.js');

var server = new WebpackDevServer(webpack(wpConfig), {
    proxy: {
        '/api/*': {
            target: 'http://localhost:7500'
        }
    },
    publicPath: wpConfig.output.publicPath,
    hot: true,
    historyApiFallback: false
});
server.listen(7000);
console.log("Open http://localhost:7000/");
