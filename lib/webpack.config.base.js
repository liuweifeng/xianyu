/**
 * @file webpack.config.base.js
 * @author 刘巍峰 <weifeng3@staff.weibo.com>
 * Created on 2016-02-13 23:53
 */
/**
 * Created by liuweifeng on 16/1/14.
 */
'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (options) {
    var hwpConfig = {
        title: options.title || '咸鱼 - 前端开发脚手架',
        template: path.join(__dirname, 'index.ejs')
    };
    if(options.template){
        let content = fs.readFileSync(path.resolve(path.join(process.cwd(), options.template)));
        if(content.indexOf('<body>') == -1){
            hwpConfig.content = content;
        }else{
            hwpConfig.templateContent = content;
        }
    }
    return {
        entry: {
            'index': path.resolve(process.cwd(), 'src/js/index')
        },
        output: {
            path: path.join(process.cwd(), ''),
            filename: '[name].js',
            publicPath: `http://dev.js.weibo.cn/${options.module}/build/`
        },
        plugins: [
            new HtmlWebpackPlugin(hwpConfig)
        ],
        resolve: {
            extensions: ['', '.js', '.vue', '.css', '.jsx'],
            modulesDirectories: ['web_modules', 'node_modules', path.join(process.cwd(), 'node_modules'), path.join(__dirname, '../node_modules')]
        },
        resolveLoader: {
            modulesDirectories: ['web_loaders', 'web_modules', 'node_loaders', 'node_modules', path.join(__dirname, '../node_modules')]
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['babel'],
                    exclude: [/node_modules/]
                },
                //{
                //    test: /\.css$/,
                //    loaders: ['style', 'css']
                //},
                {
                    test: /\.(png|jpg|gif)$/,
                    loaders: ['url', 'file']
                },
                {
                    test: /\.json/,
                    loaders: ['json']
                },
                {
                    test: /\.svg$/,
                    loaders: ['raw']
                }
            ]
        },
        babel: {
            presets: [require('babel-preset-es2015'), require('babel-preset-stage-0')],
            plugins: [require('babel-plugin-transform-runtime')]
        }
    };
};
