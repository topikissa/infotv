var webpack = require('webpack');

var CURRENT_STYLE = process.env.INFOTV_STYLE || "desucon";

module.exports = {
    context: __dirname,
    entry: "./src/main.js",
    bail: true,
    output: {
        path: __dirname + "/../static/infotv",
        filename: "bundle.js",
        publicPath: "/static/infotv"  // Nb: this may require configuration
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
