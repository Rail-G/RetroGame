const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        static: {
          directory: path.resolve(__dirname, "dist")
        },
        // open: {
        //   target: ["result.html"],
        // }
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
              },
            ],
          },
          {
            test: /\.js$/,
            loader: "babel-loader"
          },
          {
            test: /\.(png|jpg|jpeg|gif)$/,
            type: 'asset/resource'
          }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './result.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
          })
    ]
}