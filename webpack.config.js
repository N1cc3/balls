const path = require('path');

module.exports = {
  entry: [
    './src/main.js',
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
  },
  target: 'web',
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src'),
        ],
        test: /\.js$/,
      },
    ],
  },
};
