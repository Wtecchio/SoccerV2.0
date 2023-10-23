const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 8000,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
            },
            {
                test: /\.(glb|gltf|dae|fbx)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'models/[path][name].[ext]',
                            context: path.resolve(__dirname, 'resources/models'),  // Adjusted this line
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|jpeg|png|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'textures/[name].[ext]',  // Adjusted this line
                            context: path.resolve(__dirname, 'resources/models/camp futbol'),  // Adjusted this line
                        }
                    }
                ]
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        new CopyPlugin({
            patterns: [
                { from: 'resources/models', to: 'models' },
                //{ from: 'resources/models/source/footballLp.fbx', to: 'models/source/footballLp.fbx' },
                // Add more patterns here as needed
            ],
        }),
    ],
};