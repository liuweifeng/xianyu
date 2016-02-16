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
    const localConfig = require(process.cwd() + '/package.json')['xianyu'] || {};
    options = Object.assign(options, localConfig);

    const template = path.join(__dirname, 'index.ejs');
    let plugins = [];
    let entry = {};
    if (typeof options.entry === 'string') {
        options.entry = {
            'app': options.entry
        }
    }
    Object.keys(options.entry).forEach(function (e) {
        entry[e] = process.cwd() + '/' + options.entry[e];
        let hwpConfig = {
            title: options.title || '咸鱼 - 前端开发脚手架',
            template: template,
            chunks: [e],
            filename: e + '.html'
        };
        if (options.template) {
            let content = fs.readFileSync(path.resolve(path.join(process.cwd(), options.template)));
            if (content.indexOf('<body>') == -1) {
                hwpConfig.content = content;
            } else {
                hwpConfig.templateContent = content;
            }
        }
        plugins[plugins.length] = new HtmlWebpackPlugin(hwpConfig);
    });
    return {
        entry: entry,
        output: {
            path: path.join(process.cwd(), ''),
            filename: '[name].js',
            publicPath: `${options.devHost || 'http://dev.js.weibo.cn'}/${options.module}/build/`
        },
        plugins: plugins,
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
