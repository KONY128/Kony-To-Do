
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    productionSourceMap: false,
    configureWebpack: config => {
        if (isProduction) {
            // 隐藏控制台日志
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true

            // 配置chunks，让所有的node modules不要打包到一块去
            // config.optimization = {
            //     splitChunks: {
            //         minSize: 10000,
            //         maxSize: 50000,
            //         chunks:'all',
            //         maxInitialRequests:10,
            //         maxAsyncRequests:10
            //     }
            // }

            // 使用 uglifyjs-webpack-plugin 组件压缩js文件，比如去掉console和debugger
            // config.plugins.push(new UglifyJsPlugin({
            //     uglifyOptions: {
            //         compress: {
            //             drop_debugger: true,
            //             drop_console: true,  //生产环境自动删除console
            //         },
            //         warnings: false,
            //     },
            //     sourceMap: false,
            //     parallel: true,//使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
            // }))

            // 使用 compression-webpack-plugin 组件压缩成Gzip格式
            config.plugins.push(new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            }))
        }
    }
}
