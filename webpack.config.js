const { watchFiles } = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },

            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },

            {
                test: /\.html$/i,
                loader: 'html-loader',
            },

            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i, // Регулярное выражение для изображений
                use: [
                    {
                        loader: 'file-loader', // Используем file-loader
                        options: {
                            name: '[hash].[ext]', // Имя файла в выходной директории
                            outputPath: 'images', // Папка для изображений в dist
                        },
                    },
                ],
            },
        ],
    },
    devtool: 'eval-source-map',
    devServer: {
        watchFiles: ['./src/index.html'],
    },
}
