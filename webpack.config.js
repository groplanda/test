const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

console.log(process.env.NODE_ENV);

const plugins = () => {
    const list = [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, 'src/favicon.ico'),
                to: path.resolve(__dirname, 'dist')
              },
              {
                from: path.resolve(__dirname, 'src/assets/images'),
                to: path.resolve(__dirname, 'dist/images')
              },
              {
                from: path.resolve(__dirname, 'src/backend'),
                to: path.resolve(__dirname, 'dist/backend')
              }
            ]
          }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
        new SVGSpritemapPlugin('./src/assets/icons/*.svg'),
        new HtmlWebpackPlugin({
            hash: true,
            title: 'Roistat Test',
            metaDesc: 'Roistat Test',
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ];

    if (isProd) {
        list.push(new BundleAnalyzerPlugin());
    }

    return list;
};

const optimization = () => {
    const config = {
      splitChunks: {
        chunks: 'all'
      }
    };
  
    if (isProd) {
      config.minimizer = [
        new TerserWebpackPlugin(),
        new CssMinimizerPlugin()
      ];
    }
  
    return config;
};

module.exports = {
    mode: process.env.NODE_ENV,
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@js': path.resolve(__dirname, 'src/assets/js'),
            '@src': path.resolve(__dirname, 'src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                    presets: [
                        ['@babel/preset-env', { targets: "defaults" }]
                    ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                ],
            },
            {
                test: /\.(sc|sa)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                      loader: 'css-loader',
                      options: {importLoaders: 1},
                    },
                    {
                      loader: 'postcss-loader',
                      options: {
                        postcssOptions: {
                          config: path.resolve(__dirname, 'postcss.config.js'),
                        },
                      },
                    },
                    "sass-loader"
                ],
            },
            {
                test: /\.(ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: './fonts/[name][ext]'
                } 
            },
            {
                test: /\.svg/,
                type: 'asset/resource'
            }
        ],
      },
    devtool: isDev ? 'source-map' : false,
    plugins: plugins(),
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev,
        watchFiles: {
          paths: ['src/**/*'],
          options: {
            usePolling: false,
          },
        },
    }
};