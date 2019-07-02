const nodeExternals = require('webpack-node-externals');
const path = require('path');
const CURRENT_WORKING_DIR = process.cwd();

const config = {
  target: 'node',
  externals: [nodeExternals()],
  entry: [path.join(CURRENT_WORKING_DIR, './src/index.js')],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'server.generated.js',
    publicPath: '/dist/',
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      }
    ]
  }
};

module.exports = config;
