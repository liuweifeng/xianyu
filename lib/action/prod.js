/**
 * 发布模式
 */
'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = function (options) {
    let config = require('../webpack.config.prod.js')(options);
    webpack(config, function (error) {
        if (error) {
            console.error(error);
        }
    });
};