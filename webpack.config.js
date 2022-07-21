const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const productsJson = require('./src/assets/dataset.json')



const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;


module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './js/main.js',
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        clean: true,
    },
    devServer: {
        port: 3000
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            templateParameters: {
                'dataSet': productsJson
            },
            title: 'webpack setup',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new MiniCssExtractPlugin({
            filename: `./styles/${filename('css')}`
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src/assets'), to: path.resolve(__dirname, 'dist/assets') }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: 'html-loader',
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            }
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]

            },
            {
                test: /\.(?:|jpg|svg|png|jpeg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(?:|woff2|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./fonts/${filename('[ext]')}`
                    }
                }]
            },
        ]
    }
}