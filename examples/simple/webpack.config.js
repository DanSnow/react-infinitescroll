var path = require('path')
var webpack = require('webpack')

var baseConfig = {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: 'dist/'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      'react-infinitescroll': path.join(__dirname, '..', '..', 'src')
    },
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, '..', '..', 'src')
    }, {
      test: /\.css$/,
      loaders: ['style', 'css']
    }]
  }
}

if (process.env.NODE_ENV === 'production') {
  baseConfig.entry = './index'
  baseConfig.module.loaders.push({
    test: /\.js$/,
    loaders: ['babel'],
    exclude: /node_modules/,
    include: __dirname
  })
} else {
  baseConfig. devtool = 'eval'
  baseConfig.entry = [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './index'
  ]
  baseConfig.module.loaders.push({
    test: /\.js$/,
    loaders: ['react-hot', 'babel'],
    exclude: /node_modules/,
    include: __dirname
  })
  baseConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = baseConfig
