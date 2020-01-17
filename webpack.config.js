const path = require('path')
const package_json = require('./package.json')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

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
const mainConfig = {
    ...commonConfig,
    target: 'electron-main',
    entry: path.join(__dirname, 'src', 'main'),
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    node: {
        __dirname: false,
        __filename: false
    },
    module: {
        rules: [{
            test: /.ts?$/,
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        onlyCompileBundledFiles: true,
                        compilerOptions: {
                            "noUnusedLocals": false
                        }
                    }
                }
            ],
            include: [
                path.resolve(__dirname, 'src'),
            ],
            exclude: [
                path.resolve(__dirname, 'node_modules'),
            ]
        }]
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    plugins: [
        new CopyPackageJsonPlugin(
            path.join(path.resolve(__dirname, 'dist'), 'package.json'),
            {
                name:package_json.name,
                version:package_json.version,
                description: package_json.description,
                author: package_json.author
            }
        )
    ]
}

/** @type import('webpack').Configuration */
const rendererConfig = {
    ...commonConfig,
    target: 'electron-renderer',
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
            title: "Electron Template",
            filename: 'index.html',
            template: 'html/index.html',
            inlineSource: '.(js|css)$' // HtmlWebpackInlineSourcePlugin
        }),
      new HtmlWebpackInlineSourcePlugin()
    ]
}

module.exports = [rendererConfig, mainConfig]
