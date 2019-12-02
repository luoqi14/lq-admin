const webpack = require('webpack');
const path = require('path');
const HappyPack = require('happypack');
const os = require('os');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: false,
    minimize: {
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions'],
      },
      discardComments: {
        removeAll : true,
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
      sourcemap: false,
    },
  },
};

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router-dom',
      'redux',
      'moment',
      'lodash',
      'core-js',
      'antd',
      'xlsx',
      'whatwg-fetch/fetch.js',
      'reselect/lib/index.js',
      'redux-thunk/es/index.js',
      'redbox-react/lib/style.js',
      'redbox-react/lib/lib.js',
      'redbox-react/lib/index.js',
      'react-custom-scrollbars',
      'html-entities/lib/html5-entities.js',
      'html-entities/lib/html4-entities.js',
      'regenerator-runtime/runtime.js',
      'eventsource-polyfill/dist/eventsource.js',
      'history/createBrowserHistory.js',
      'url/url.js',
    ],
  },
  output: {
    path: path.join(__dirname, '../dll'),
    filename: '[name].dll.js',
    library: '_dll_[name]',
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new webpack.DllPlugin({
      path: path.join(__dirname, '../dll/manifest.json'),
      name: '_dll_[name]',
    }),
    new HappyPack({
      id: 'happyBabel',
      loaders: [{
        loader: 'babel-loader',
        cacheDirectory:  true,
      }],
      threadPool: happyThreadPool,
      verboseWhenProfiling: true,
    }),
  ],
  module: {
    rules: [{
      test    : /\.(js|jsx)$/,
      exclude : /node_modules/,
      use: 'happypack/loader?id=happyBabel',
    }, {
      test: /\.css$/,
      use: [
        cssLoader,
      ],
    }, {
      test: /\.less$/,
      use: [
        {
          loader: 'style-loader',
        },
        cssLoader,
        {
          loader: 'less-loader',
          options: {
            modifyVars: {
              '@primary-color': '#3373CC',
              '@icon-url': '"/iconfont/iconfont"',
            },
          },
        }],
    }, {
      test: /\.(sass|scss)$/,
      use: [
        {
          loader: 'style-loader',
        },
        cssLoader,
        {
          loader: 'sass-loader',
          options: {
            sourceMap: false,
          },
        },
        {
          loader: '@epegzz/sass-vars-loader',
          options: {
            vars: {
              'primary-color': '#3373CC',
            },
          },
        },
      ],
    }],
  },
};
