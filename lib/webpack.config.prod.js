/**
 * @file webpack.config.prod.js
 * @author 刘巍峰 <weifeng3@staff.weibo.com>
 * Created on 2016-01-14 12:14
 */
'use strict';
module.exports = function (options) {
  return require('./webpack.config.base.js')(options, 'deploy');
};
