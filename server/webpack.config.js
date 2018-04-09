module.exports = {
    devtool: 'source-map',
    target: 'node',
    entry:  {
        app : __dirname + "/src/index.js",
    },
    output: {
        path: __dirname + "/../dist",
        filename: "main.js"
    }
};