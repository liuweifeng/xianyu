/**
 * 开发模式
 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

module.exports = function (options) {
    console.log('Loading config info...');
    let config = require('../webpack.config.dev.js')(options);
    var bundleStart = null;
    var compiler = webpack(config);

    // We give notice in the terminal when it starts bundling and
    // set the time it started
    compiler.plugin('compile', function() {
        console.log('Bundling...');
        bundleStart = Date.now();
    });

    // We also give notice when it is done compiling, including the
    // time it took. Nice to have
    compiler.plugin('done', function() {
        console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
    });
    var server = new WebpackDevServer(compiler, {
        //historyApiFallback: true,
        hot: true,
        inline: true,
        stats: {
            colors: true
        },
        progress: true,
        publicPath: config.output.publicPath
    });
    server.listen(options.port || 8080, '0.0.0.0', function () {
        console.log('Bundling project, please wait...');
    });
};