/**
 * @file webpack.config.base.js
 * @author 刘巍峰 <weifeng3@staff.weibo.com>
 * Created on 2016-02-13 23:53
 */
'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');

module.exports = function (options, act) {
  const packageConfig = require(`${process.cwd()}/package.json`).xianyu || {};
  options = Object.assign(options, packageConfig);

  const localConfigFilePath = path.join(process.cwd(), 'webpack.config.js');
  const template = path.join(__dirname, 'index.ejs');
  let plugins = [];
  let entry = {};
  let devServer = [
    'webpack/hot/only-dev-server',
    `webpack-dev-server/client?http://0.0.0.0:${options.port || 8080}`
  ];
  if (typeof options.entry === 'string') {
    options.entry = {
      app: options.entry
    };
  }
  Object.keys(options.entry).forEach(function (e) {
    let oldEnrty = options.entry[e];
    if (typeof oldEnrty === 'string') {
      oldEnrty = [process.cwd() + '/' + oldEnrty];
    }
    if (act === 'dev' && options.hot) {
      oldEnrty = devServer.concat(oldEnrty);
    }
    let hwpConfig = {
      title: options.title || '咸鱼 - 前端开发脚手架',
      template: template,
      chunks: [e],
      filename: e + '.html'
    };
    entry[e] = oldEnrty;
    if (act !== 'deploy') {
      if (act === 'dev' && options.hot) {
        hwpConfig.chunks.push(devServer);
      }
      let tpl;
      if (options.template) {
        tpl = path.resolve(path.join(process.cwd(), options.template));
      } else {
        tpl = path.resolve(path.join(process.cwd(), `src/html/${e}.html`));
      }
      if (fs.existsSync(tpl)) {
        const content = fs.readFileSync(tpl, 'utf-8');
        if (content.indexOf('<body>') === -1) {
          hwpConfig.content = content;
        } else {
          hwpConfig.templateContent = content;
        }
      }
      plugins[plugins.length] = new HtmlWebpackPlugin(hwpConfig);
    }
  });

  function makeOutput() {
    let output = {
      path: path.join(process.cwd(), ''),
      filename: '[name].js',
      publicPath: `${options.devHost || 'http://dev.js.weibo.cn'}/${options.module}/build/`
    };
    output = Object.assign(output, options.output || {});
    if (act === 'dev') {
      output.pathinfo = true;
      return output;
    }
    if (act === 'build') {
      output.path = path.join(process.cwd(), '/build');
      return output;
    }
    if (act === 'deploy') {
      return {
        path: path.join(process.cwd(), '/.release/build'),
        publicPath: `${options.cdnHost || '//h5.sinaimg.cn'}/${options.module}/build/`,
        filename: 'js/[name].[chunkhash:8].js'
      };
    }
    return output;
  }

  let config = {
    entry: entry,
    output: makeOutput(),
    plugins: plugins,
    resolve: {
      extensions: ['', '.js', '.vue', '.css', '.jsx', '.ejs'],
      root: [
        process.cwd(),
        path.join(process.cwd(), 'node_modules'),
        path.join(__dirname, '../node_modules')
      ]
    },
    resolveLoader: {
      root: [
        path.join(process.cwd(), 'node_modules'),
        path.join(__dirname, '../node_modules')
      ]
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: [/node_modules/]
      }, {
        test: /\.json/,
        loaders: ['json']
      }, {
        test: /\.ejs$/,
        loaders: ['ejs-compiled']
      }]
    },
    babel: {
      presets: [
        require('babel-preset-es2015'),
        require('babel-preset-stage-0'),
        require('babel-preset-react')
      ],
      plugins: [
        require('babel-plugin-transform-runtime')
      ]
    }
  };
  if (options.module && options.module.loaders) {
    config.module.loaders = config.module.loaders.concat(options.module.loaders);
  }
  if (act === 'dev') {
    config.plugins.unshift(new webpack.NoErrorsPlugin());
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
    config.plugins.push(new webpack.DefinePlugin({
      __DEV__: true,
      'process.env': JSON.stringify('development')
    }));
    config.babel.env = {
      development: {
        presets: [
          require('babel-preset-react-hmre')
        ]
      }
    };
    config.module.loaders.push({
      test: /\.css$/,
      loaders: ['style', 'css']
    });
    config.module.loaders.push({
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader',
      exclude: [/node_modules/]
    });
  }
  if (act === 'build') {
    config.module.loaders.push({
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    });
    config.module.loaders.push({
      test: /\.(png|jpg|gif)$/,
      // loader: 'file-loader?context=src&name=[path][name].[ext]',
      loader: 'file-loader?name=[name].[ext]',
      exclude: [/node_modules/]
    });
    config.plugins.push(new ExtractTextPlugin('[name].css'));
    config.plugins.push(new ProgressBarPlugin());
  }
  if (act === 'deploy') {
    config.module.loaders.push({
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader?limit=8192&name=[path][name].[hash:8].[ext]&context=src'
    });
    config.module.loaders.push({
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    });
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
    config.plugins.push(new WebpackMd5Hash());
    config.plugins.push(new webpack.BannerPlugin('Weibo HTML5\n(c) 2016 Weibo Corporation'));
  }
  config['ejs-compiled-loader'] = {
    htmlmin: true,
    htmlminOptions: {
      removeComments: true,
      collapseWhitespace: true
    }
  };


  if (fs.existsSync(localConfigFilePath)) {
    config = merge(config, require(localConfigFilePath));
  }
  return config;
};
