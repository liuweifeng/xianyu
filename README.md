# 咸鱼

> 人如果没有理想，那和咸鱼有什么区别？

这是一个「约定大于配置的」Webpack 工作流程，包含了开发、联调、发布的全生命周期。

**开发过程中，API 会频繁修改，请勿使用**

## 安装
这是一个全局命令行工具，安装一次，在不同的项目中使用时，不需要再次安装，等待漫长的 `npm install`。
```
npm i -g xianyu
```

## 功能

提供了三个命令来解决前端开发生命周期内的所有任务：

* 开发
`xianyu dev`
使用 `webpack-dev-server`，
* 联调
`xianyu build`
构建文件到 `build`目录
* 发布
`xianyu deploy`
构建 hash 后的文件到 .release 目录

## 配置
根据「约定大于配置」的原则，此工具及工作流程中的大部分配置都是约定好的，开发者使用仅需要在自己项目的 `package.json` 里，添加`xianyu`配置字段来自定义。
例如：
```
  "xianyu": {
    "module": "m/article",
    "port": "8080",
    "devHost": "http://dev.weibo.cn",
    "cdnHost": "//cdn.weibo.cn",
    "title" : "头条文章",
    "entry": {
      "enter" : "src/js/enter.js",
      "simple" : "src/js/simple.js"
    }
  }
```
以上，除了 `entry` 即 webpack 的入口文件之外，均为可选




