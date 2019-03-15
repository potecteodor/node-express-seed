const nodeExternals = require('webpack-node-externals')
const fs = require('fs')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const dir = __dirname.replace('server', 'build')

module.exports = {
  entry: { app: './src/main.ts' },
  target: 'node',
  context: __dirname,
  externals: [nodeExternals()],
  output: {
    path: path.join(dir, '/server'),
    filename: 'ejs-api.js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'package.json' },
      {
        from: './src/config/config.qa.json',
        to: 'config/config.dev.json',
        flatten: true,
      },
      { from: './static/email/*.html', to: 'static/email', flatten: true },
    ]),
  ],
  node: {
    __dirname: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
}
