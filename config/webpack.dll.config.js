const webpack = require('webpack');
const path = require('path');
const HappyPack = require('happypack');
const os = require('os');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

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
      // 'antd/es/spin/style/index.js',
      // 'antd/es/breadcrumb/style/index.js',
      // 'antd/es/button/style/index.js',
      // 'antd/es/cascader/style/index.js',
      // 'antd/es/checkbox/style/index.js',
      // 'antd/es/col/style/index.js',
      // 'antd/es/date-picker/style/index.js',
      // 'antd/es/dropdown/style/index.js',
      // 'antd/es/form/style/index.js',
      // 'antd/es/grid/style/index.js',
      // 'antd/es/icon/style/index.js',
      // 'antd/es/input-number/style/index.js',
      // 'antd/es/input/style/index.js',
      // 'antd/es/layout/style/index.js',
      // 'antd/es/locale-provider/style/index.js',
      // 'antd/es/menu/style/index.js',
      // 'antd/es/message/style/index.js',
      // 'antd/es/modal/style/index.js',
      // 'antd/es/notification/style/index.js',
      // 'antd/es/pagination/style/index.js',
      // 'antd/es/popconfirm/style/index.js',
      // 'antd/es/popover/style/index.js',
      // 'antd/es/progress/style/index.js',
      // 'antd/es/radio/style/index.js',
      // 'antd/es/row/style/index.js',
      // 'antd/es/select/style/index.js',
      // 'antd/es/switch/style/index.js',
      // 'antd/es/table/style/index.js',
      // 'antd/es/tabs/style/index.js',
      // 'antd/es/time-picker/style/index.js',
      // 'antd/es/tooltip/style/index.js',
      // 'antd/es/upload/style/index.js',
      'lq-tool/lib/CityUtil/index.js',
      'lq-tool/lib/DateUtil/index.js',
      'lq-fetch/lib/index.js',
      'whatwg-fetch/fetch.js',
      'reselect/lib/index.js',
      'redux-thunk/es/index.js',
      'redbox-react/lib/style.js',
      'redbox-react/lib/lib.js',
      'redbox-react/lib/index.js',
      // 'react-quill/lib/toolbar.js',
      // 'react-quill/lib/mixin.js',
      // 'react-quill/lib/index.js',
      // 'react-quill/lib/component.js',
      'react-custom-scrollbars',
      // 'quill/dist/quill.js',
      // '@f12/components',
      'html-entities/lib/html5-entities.js',
      'html-entities/lib/html4-entities.js',
      'regenerator-runtime/runtime.js',
      'eventsource-polyfill/dist/eventsource.js',
      'history/createBrowserHistory.js',
      'url/url.js',
      path.join(__dirname, '../lib/crypto-js.js'),
    ],
  },
  output: {
    path: path.join(__dirname, '../dll'),
    filename: '[name].dll.js',
    library: '_dll_[name]',
  },
  plugins: [
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
