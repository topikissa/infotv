var webpack = require('webpack');

var CURRENT_STYLE = process.env.INFOTV_STYLE || "desucon";
var outputFsPath = process.env.OUTPUT_PATH || (__dirname + "/../static/infotv");
var outputPublicPath = process.env.PUBLIC_PATH || "/static/infotv";

module.exports = {
    context: __dirname,
    entry: "./src/main.js",
    bail: true,
    output: {
        path: outputFsPath,
        filename: "bundle.js",
        publicPath: outputPublicPath
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            },
            {
                test: /\.(woff|svg|otf|ttf|eot|png)(\?.*)?$/,
                loader: 'url'
            }
        ]
    },
    resolve: {
        alias: {
            "current-style": "../styles/" + CURRENT_STYLE + "/less/style.less"
        }
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|fi/)
    ]
};
