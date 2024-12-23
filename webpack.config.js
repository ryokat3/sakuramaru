const path = require('path')
const package_json = require('./package.json')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineSourceWebpackPlugin = require('inline-source-webpack-plugin')

class CopyPackageJsonPlugin {
    constructor(filePath, template) {
        this.filePath = filePath    
        this.template = template
    }
    apply(compiler) {
        compiler.hooks.assetEmitted.tap('Copy package.json Plugin', (fileName, content) => {
            fs.writeFileSync(this.filePath, JSON.stringify({
                ...this.template,
                main: fileName
            }))     
        })
    }
}

/** @type import('webpack').Configuration */
const commonConfig = {
    mode: 'development'
}

/** @type import('webpack').Configuration */
const rendererConfig = {
    ...commonConfig,
    target: 'web',
    entry: path.join(__dirname, 'src', 'renderer', 'index'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx', '.css', '.ts', '.tsx']
    },
    module: {
        rules: [{
            test: /\.(tsx|ts)$/,
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        onlyCompileBundledFiles: true
                    }
                }
            ],
            include: [
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'node_modules'),
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Sakuramaru",
            filename: 'index.html',
            template: 'html/index.html'            
        }),
        new InlineSourceWebpackPlugin()
    ]
}

module.exports = [rendererConfig]
