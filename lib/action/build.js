/**
 * 构建模式
 */
'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = function (options) {
    let config = require('../webpack.config.build.js')(options);
    webpack(config, function (error) {
        if (error) {
            console.error(error);
        }
    });
};