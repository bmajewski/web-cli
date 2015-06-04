var Webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var path = require("path");
var fs = require("fs");
var config = require("./config.json");

var mainPath = config.mainPath;

module.exports = function(){

    var start = null;
    var compiler = Webpack(webpackConfig);

    compiler.plugin("compile", function(){
        console.log("Bundling...");
        start = Date.now();
    });

    compiler.plugin("done", function(){
        console.log("Bundling completed in " + (Date.now() - start) + " ms");
    });

    var bundler = new WebpackDevServer(compiler, {
        publicPath: "/build/",
        hot: true,
        quiet: false,
        noInfo: true,
        stats: {
            colors: true
        }
    });

    bundler.listen(8080, "localhost", function() {
        console.log("Bundling project, please wait...");
    });
};