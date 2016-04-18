/**
 * 发布模式
 */
'use strict';
const webpack = require('webpack');

module.exports = function (options) {
  const config = require('../webpack.config.prod.js')(options);
  webpack(config, function (error) {
    if (error) {
      console.error(error);
    }
  });
};
