const webpack = require("webpack");

const CURRENT_STYLE = process.env.INFOTV_STYLE || "desucon";
const outputFsPath = process.env.OUTPUT_PATH || `${__dirname}/../static/infotv`;
const outputPublicPath = process.env.PUBLIC_PATH || "/static/infotv";
const production = process.argv.indexOf("-p") !== -1;

const config = {
    context: __dirname,
    entry: ["whatwg-fetch", "./src/main.js"],
    bail: true,
    devtool: "source-map",
    output: {
        path: outputFsPath,
        filename: "bundle.js",
        publicPath: outputPublicPath,
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel",
            },
            {
                test: /\.(woff|svg|otf|ttf|eot|png)(\?.*)?$/,
                loader: "url",
            },
        ],
    },
    resolve: {
        alias: {
            "current-style": `../styles/${CURRENT_STYLE}/less/style.less`,
        },
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|fi/),
    ],
};

if (production) {
    config.plugins.push(
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production"),
            },
        })
    );
}

module.exports = config;
