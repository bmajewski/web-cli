var webpack = require("webpack");
var express = require("express");
var path =  require("path");
var httpProxy = require("http-proxy");
var morgan = require("morgan");
var config = require("./config.json");
var webpackConfig = require("./webpack.config.js");

var proxy = httpProxy.createProxyServer();
var app = express();


var production = process.env.CLI_ENV === "production";
var port = production ? config.port.prod :  config.port.dev;
var publicPath = path.resolve(__dirname, config.publicPath);

app.use(morgan(production ? "combined" : "dev"));
app.use(express.static(publicPath));

var apiProxies = config.apiProxies;

apiProxies.forEach(function(api){
    console.log("Mapping " + api.path + " to " + api.target);
    app.all(api.path, function(req,res){
        proxy.web(req,res, {target: api.target});
    });
});

if (!production){
    var bundler = require("./bundler.js");
    bundler();

    app.all("/" + config.buildPath + "/*", function(req,res){
       proxy.web(req, res,{target: "http://localhost:" + config.port.prod});
    });
} else {
    console.log("Initiating Production Build");
    console.log("webpackConfig", webpackConfig);
    webpack(webpackConfig, function(err, stats){
        if (err) {
            console.log("err", err);
        } else {
            console.log("Production Build complete");
        }
    });
}

proxy.on("error", function(e){
    console.log("Proxy Error", e);
});

app.listen(port, function(){
    console.log("Server listening on port", port);
});