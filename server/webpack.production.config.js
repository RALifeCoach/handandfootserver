const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',

    target: 'node',

    entry: [
        './src/index'
    ],

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js',
        publicPath: '/dist/'
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: /src/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};
