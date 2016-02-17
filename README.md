# 咸鱼
[![npm](https://img.shields.io/npm/dt/xianyu.svg?style=flat-square)](https://www.npmjs.com/package/xianyu)
[![npm](https://img.shields.io/npm/v/xianyu.svg?style=flat-square)](https://www.npmjs.com/package/xianyu)
[![npm](https://img.shields.io/npm/l/xianyu.svg?style=flat-square)](https://www.npmjs.com/package/xianyu)

> 人如果没有理想，那和咸鱼有什么区别？

这是一个「约定大于配置的」Webpack 工作流程，包含了开发、联调、发布的全生命周期。

**开发过程中，API 会频繁修改，请勿使用**

## 动机
`webpack` 是目前最好的前端模块化解决方案，与 `babel` 结合，可无缝使用 ES6 新特性，与 `webpack-dev-server` 配合，又可实现开发过程中，代码热替换，极大地提升了开发体验。
但是，要想打造一个适合自己团队使用的 `webpack.config.js` ，需要花费大量的时间来阅读文档，webpack 官方的文档并不是特别详细，有些配置项需要多次尝试揣摩才能找到正确的姿势；而且，由于依赖于 `babel` ，安装依赖的过程比较痛苦，尤其是像我们这样，项目的颗粒度比较细，每次新建一个项目都需要安装一大坨依赖的话，耗时且蛋疼。于是，我们总结出来一个**全局安装**、**基本无需配置** 的开发工具，来简化和规范大家日常的开发流程。
## 安装
这是一个全局命令行工具，安装一次，在不同的项目中使用时，不需要再次安装，等待漫长的 `npm install`。
```
npm i -g xianyu
```
## 功能

「咸鱼」提供了三个命令来解决前端开发生命周期内的所有任务：

* 开发  
`xianyu dev`  
使用 `webpack-dev-server`，
* 联调  
`xianyu build`  
构建文件到 `build`目录。
* 发布  
`xianyu deploy`  
构建 hash 后的文件到 .release 目录

## 约定
以上三个命令，均是在项目的根目录执行。约定 `src` 目录存放源码，`build` 存放构建完成的代码，`.release` 目录存放经过压缩混淆以及 MD5 改名之后的资源，可直接用于发布到 CDN。

## 配置
根据「约定大于配置」的原则，此工具及工作流程中的大部分配置都是约定好的，开发者使用仅需要在自己项目的 `package.json` 里，添加`xianyu`配置字段来自定义。
例如：

```
  "xianyu": {
    "module": "m/article",
    "port": "8080",
    "devHost": "http://dev.weibo.cn",
    "cdnHost": "//h5.sinaimg.cn",
    "title" : "头条文章",
    "entry": {
      "enter" : "src/js/enter.js",
      "simple" : "src/js/simple.js"
    }
  }
```
以上，除了 `entry` 即 webpack 的入口文件之外，均为可选。

## 原理与示例
根据上面的示例配置，假定我们配置的开发环境域名是 `http://dev.js.weibo.cn`，发布后的 CDN 域名是 `http://h5.sinaimg.cn`，我们的项目名称是 `m/article`。
在项目的根目录执行 `xianyu dev` 后，访问 [](http://dev.js.weibo.cn/m/article/build/enter.js)，即可访问 `src/js/enter.js` 对应的编译好的文件，此时访问的是 `webpack-dev-server` 在内存中的数据，每次代码改动并保存后会立即更新，由于是**内存存储，不会像 `grunt` 或者 `gulp` 一样写硬盘，会快很多**。

当我们开发完，需要跟后端联调，那么执行 `xianyu build`，就会将代码编译并写入到 `build` 目录。再次访问以上链接，就是读取的本地的资源了。

以上逻辑需要使用 `nginx` 来做代理，参考的实现如下：

```nginx
server {
    listen          80;
    server_name     dev.css.weibo.cn dev.js.weibo.cn;
    access_log      off;
    error_log       off;

    set $root /Users/liuweifeng/work/h5.sinaimg.cn;

    root $root;

    location / {
      proxy_pass          http://127.0.0.1:8080;
      expires             0;
      gzip                on;
      proxy_redirect      off;
      proxy_set_header    Host              $host;
      proxy_set_header    X-Real-IP         $remote_addr;
      proxy_set_header    X-Forwarded-for   $remote_addr;
      error_page 502 = @fallbackToLocal;
    }

    location ~* \.(eot|ttf|woff)$ {
       add_header Access-Control-Allow-Origin *;
    }

    location @fallbackToLocal {
      internal;
      root $root;
      index index.html;
      autoindex on;
      try_files $uri $uri/index.html;
    }
}
```
联调结束需要上线了，执行 `xianyu deploy` 后，会生成上线资源到 .release 目录。我们这一步是在 Gitlab CI 里完成的，会自动将此目录发布到 CDN，按照上面的约定，上线后资源的路径是：`http://h5.sinaimg.cn/m/article/build/enter.377e4946.js`。其中后缀 `377e4946` 是 `webpack` 自动计算的文件 MD5 的前 8 位。

同时，会生成一个资源对应表，`webpack-assets.json`，来指定文件名和它在 CDN 上路径的对应关系。示例如下：
```
{
  "enter": {
    "js": "js/enter.377e4946.js"
  }
}
```
在我们的 CI 发布流程中，会在 CDN 发布成功后，将此文件推送给 PHP 仓库，与 PHP 代码同步上线。

以上这么做的初衷是，我们前后端是两个 Team 来开发的，模板在后端，那么需要显式地在模板里指定需要加载的资源的路径，如果开发、联调、生产三个阶段路径不同，中间必然会出现人肉修改路径的操作，是个隐患。我们开发了 PHP 的视图扩展，来自动地做这个事情，生产环节读取配置文件输出在 CDN 的真实路径，否则就输出开发环境的域名。而在开发流程中，根据前端开发同事的需求，nginx 自动判断是读取内存数据还是文件。



