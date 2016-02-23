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
        let tpl;
        if (options.template) {
            tpl = path.resolve(path.join(process.cwd(), options.template));
        }else {
            tpl = path.resolve(path.join(process.cwd(), `src/html/${e}.html`));
        }
        if(fs.existsSync(tpl)){
            let content =fs.readFileSync(tpl, 'utf-8');
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
            root: [path.join(process.cwd(), 'node_modules'), path.join(__dirname, '../node_modules')]
        },
        resolveLoader: {
            root: [path.join(process.cwd(), 'node_modules'), path.join(__dirname, '../node_modules')]
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
