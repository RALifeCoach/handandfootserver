module.exports = {
    devtool: 'source-map',

    entry:  {
        app : __dirname + "/src/index.js",
    },

    output: {
        path: __dirname + '/../public',
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
            },
            {
                test: /\.(html|js)$/,
                include: /src\/static/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(css)$/,
                include: [/src/, /node_modules/],
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};
