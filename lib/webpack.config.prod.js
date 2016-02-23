/**
 * @file webpack.config.prod.js
 * @author 刘巍峰 <weifeng3@staff.weibo.com>
 * Created on 2016-01-14 12:14
 */
'use strict';
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = function (options) {
    var config = require('./webpack.config.base.js')(options);
    config.output.path = path.join(process.cwd(), '/.release/build');
    config.output.publicPath = `${options.cdnHost || '//h5.sinaimg.cn'}/${options.module}/build/`;
    config.output.filename = 'js/[name].[chunkhash:8].js';
    config.module.loaders.push({
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192&name=[path][name].[hash:8].[ext]&context=src'
    });
    config.module.loaders.push({
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    });
    config.plugins.pop();// 生产模式不构建 HTML
    config.plugins.push(new ExtractTextPlugin('css/[name].[contenthash:8].css'));
    config.plugins.push(new ProgressBarPlugin());
    config.plugins.push(new AssetsPlugin({
        prettyPrint: true,
        fullPath: true
    }));
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
    config.plugins.push(new webpack.BannerPlugin('Weibo HTML5\n(c) 2016 Weibo Corporation'));
    return config;
};
