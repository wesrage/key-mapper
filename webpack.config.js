var path = require('path')

module.exports = {
  target: 'electron',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: './src/index',
    hud: './src/hud-index',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: 'dist/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-1'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        use: 'file-loader',
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}
