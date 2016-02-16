/**
 * @file webpack.config.build.js
 * @author 刘巍峰 <weifeng3@staff.weibo.com>
 * Created on 2016-01-14 12:14
 */
'use strict';
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = function (options) {
    var config = require('./webpack.config.base.js')(options);
    config.output.path = path.join(process.cwd(), '/build');
    //config.output.publicPath += 'build/';
    config.module.loaders.push({
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    });
    config.module.loaders.push({
        test: /\.(png|jpg|gif)$/,
        //loader: 'file-loader?context=src&name=[path][name].[ext]',
        loader: 'file-loader?name=[name].[ext]',
        exclude: [/node_modules/]
    });
    config.plugins.push(new ExtractTextPlugin('[name].css'));
    config.plugins.push(new ProgressBarPlugin());
    return config;
};
