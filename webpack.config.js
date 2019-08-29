let path = require("path") //node核心模块解析当前路径生成绝对路径
let HtmlWepackPlugin = require("html-webpack-plugin") //html模板
let MiniCssExtractPlugin = require("mini-css-extract-plugin") //抽离css文件为link插入html中 用了这个就无须使用styleloaderle 
let OptimizeCss = require("optimize-css-assets-webpack-plugin") //当使用插件压缩css时，原先的生产环境webpack自动压缩js的配置会失效，需要添加uglyfyjs来压缩js
let UglifyJsPlugin = require("uglifyjs-webpack-plugin")


module.exports = {
    devServer: {
        port: 3000,
        progress: true,
        contentBase: "./cons",
        open: true
    },
    watch: true,

    // 当代码变更实时打包编译,不是热更新，是生成实时的打包实体文件
    //需要热更新只需要把mode更变成development
    watchOptions: {
        poll: 3000, //可控制时间打包
        aggregateTimeout: 500, //五百毫秒内如果输入就不打包
        ignored: / node_modules / //无需监控哪个文件
    },

    optimization: { //压缩css代码，同时webpack自带的生产环境压缩失效需要用到uglifyjs插件
        minimizer: [
            new OptimizeCss(),
            new UglifyJsPlugin()
        ]
    },
    devtool: "source-map", //压缩打包后运行可以在源码中调试,必须在开发环境中才能生效
    mode: "development", //生成环境和开发环境，主要用于代码压缩
    entry: "./src/index.js",
    output: {
        filename: "index.js", //index.js输出文件要和src下的引入html中的js的名字相同 
        path: path.resolve(__dirname, "cons") //在当前路径下生成cons文件夹
    },
    plugins: [
        new HtmlWepackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            minify: { //压缩html模板
                removeAttributeQuotes: true, //双引号变单引号
                collapseWhitespace: true, //折叠空行
                hash: true //计算文件hash
            }

        }),
        new MiniCssExtractPlugin({ //可以自动插入link标签
            filename: "main.css"
        })
    ],
    module: {
        //css loader 处理@import这种语法 
        // style loader 可以处理把css插入head标签中 
        // use后面如果需要多个loader为数组，如果只有一个直接使用字符串
        // loader的顺序为从右向左执行
        // loader还可以写成对象方式
        rules: [
            //     {
            //     test: /\.js$/,
            //     use: {
            //         loader: "eslint-loader",
            //         // 可以最早执行
            //         options: {
            //             enforce: "pre"
            //         }
            //     }

            // }, 
            {
                test: /\.html$/,
                use: "html-withimg-loader"

            },
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: "file-loader"
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"] // 加上之后所有的css文件都会被打包成一个main.css文件后直接由模板html自动引入
            }, {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env"
                        ]
                    }
                }
            },
        ]
    }
}




// webpack 命令
// webpack默认只支持js文件
// npx webpack 找到src下的index.js文件
// npx webpack --config [文件名] 指定配置文件的名称
//npx webpack-dev-server 可以在本地生成服务器让项目运行在localhost 并且不会生成打包文件，所以此时无法
// 手动添加html引入js文件，就需要htmlwebpackplugin支持,这个插件会自动引入对应的js打包文件，无需手动添加
//通过devServer来配置port contentBase open progress等
//使用htmlwebpackplugin 可以生成html模板来运行打包后的程序，注意此时webpack打包后为js
// 文件。不会打包html模板如果不用htmlwebpackplugin就不能在打包后的dist文件夹
// 直接运行代码,需要手动添加html文件然后引入js文件，使用htmlwebpackplugin后
// 可以直接生成可运行的html文件自动引入js
// postcss-loader + autoprefixer 使用后可以让webpack自动给一些样式加上浏览器前缀


// babel-loader用于转化es6 => es5 如果处理一些简单的语法需要安装三个插件一个是
// babel-loader,@babel/core,@babel/preset-env(此插件用于转化) 使用方式在上面 
// @babel/ polyfill是可以实现更高级的语法的补丁，只要在需要用到的js文件中引入即可
//关于eslint的配置.eslint.json,可以根据公司需求去官网上下载对应的配置文件