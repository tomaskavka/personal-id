module.exports = {
  entry: {
    'personal-id': './src/personal-id',
  },
  output: {
    path: './',
    filename: 'personal-id.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
    }],
  },
};
