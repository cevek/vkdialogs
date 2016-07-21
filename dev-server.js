var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var wpConfig = require('./webpack.config');

var server = new WebpackDevServer(webpack(wpConfig), {
    publicPath: wpConfig.output.publicPath,
    hot: true,
    historyApiFallback: false
});
server.listen(7000);
console.log("Open http://localhost:7000/");
