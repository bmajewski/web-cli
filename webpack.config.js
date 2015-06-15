var Webpack = require("webpack");
var path = require("path");
var nodeModules = path.resolve(__dirname, "node_modules");

var config = require("./config.json");
var production = process.env.CLI_ENV === "production";

var entry = [path.resolve(config.mainPath)];
if (!production) {
    entry.unshift("webpack/hot/dev-server", "webpack-dev-server/client?http://127.0.0.1:" + config.port.prod);
}
var webpackConfig = {
    devtool: production ? "source-map" : "eval",
    entry: entry,
    output: {
        path: path.resolve(config.publicPath + "/" + config.buildPath),
        filename: config.bundleName,
        publicPath: path.resolve(config.buildPath)
    },

    module: {
        loaders: [
            {test: /\.js$/, loader: "babel", exclude: [nodeModules]},
            {test: /\.css$/, loader: "style!css"}
        ]
    },
    plugins: production
    ? [new Webpack.optimize.DedupePlugin(), new Webpack.optimize.UglifyJsPlugin()]
    : [new Webpack.HotModuleReplacementPlugin()]

};
module.exports = webpackConfig;