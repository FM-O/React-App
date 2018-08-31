const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// CONFIG
const PLUGINS = [
    new ExtractTextPlugin('css/styles.css')
];

const CSS_LOADER_CONFIG = [
    {
        loader: 'css-loader'
    },
    {
        loader: 'sass-loader'
    }
];


module.exports = {
  // the entry file for the bundle
  entry: path.join(__dirname, '/client/src/app.jsx'),

  // the bundle file we will get in the result
  output: {
    path: path.join(__dirname, '/client/dist'),
    filename: 'js/app.js'
  },

  module: {
    // apply rules to files that meet given conditions
    loaders: [{
        test: /\.jsx?$/,
        include: path.join(__dirname, '/client/src'),
        use: {
            'loader': 'babel-loader',
            'query': {
                presets: ["react", "es2015"]
            }
        }
    },
    {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: CSS_LOADER_CONFIG
        })
    }]
  },
  plugins: PLUGINS,

  // start Webpack in a watch mode, so Webpack will rebuild the bundle on changes
  watch: true
};
