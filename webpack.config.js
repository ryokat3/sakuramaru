const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')

class CopyPackageJsonPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('Copy package.json Plugin', (
            stats /* stats is passed as argument when done hook is tapped.  */
        ) => {
            const package_json = JSON.parse(fs.readFileSync('package.json'))
            fs.writeFileSync('dist/package.json', JSON.stringify({
                name: package_json.name,
                version: package_json.version,
                main: package_json.main                
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
        new CopyPackageJsonPlugin()
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
            template: 'html/index.html'
        })
    ]
}

module.exports = [rendererConfig, mainConfig]
