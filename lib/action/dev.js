/**
 * 开发模式
 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

module.exports = function (options) {
    let config = require('../webpack.config.dev.js')(options);
    var server = new WebpackDevServer(webpack(config), {
        historyApiFallback: true,
        hot: true,
        inline: true,
        stats: {
            colors: true
        },
        progress: true,
        publicPath: config.output.publicPath
    });
    server.listen(options.port || 8080, '0.0.0.0', function () {

    });
};