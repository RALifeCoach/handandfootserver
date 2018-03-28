const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'source-map',

    entry: [
        './src/index'
    ],

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js'
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: /src/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['env', 'react']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};
