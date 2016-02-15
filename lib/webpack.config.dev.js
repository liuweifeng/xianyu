/**
 * Created by liuweifeng on 16/1/14.
 */
'use strict';
const webpack = require('webpack');

module.exports = function (options) {
    var config = require('./webpack.config.base.js')(options);
    config.entry['webpack-dev-server'] = [
        'webpack/hot/only-dev-server',
        `webpack-dev-server/client?http://localhost:${options.port || 8080}`];
    config.module.loaders.push({
        test: /\.css$/,
        loaders: ['style', 'css']
    });
    config.plugins.unshift(new webpack.NoErrorsPlugin());
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
    return config;
};
