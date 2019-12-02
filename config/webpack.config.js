// function sleep(milliSeconds) {
//   const startTime = new Date().getTime();
//   while (new Date().getTime() < startTime + milliSeconds);
// }
// sleep(5000);
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const project = require('./project.config');
const debug = require('debug')('app:config:webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const { __LOCAL__, __ONLINE__ } = project.globals;

debug('Creating configuration.');

const mode = __LOCAL__ ? 'development' : 'production';

const webpackConfig = {
  devtool: project.compiler_devtool,
  resolve: {
    modules: [
      project.paths.client(),
      path.resolve(__dirname, '../node_modules'),
    ],
    extensions: ['*', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [],
  },
  mode,
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
};
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = project.paths.client('main.jsx');

if (!__LOCAL__) {
  const opt = webpackConfig.optimization;
  webpackConfig.optimization = Object.assign({}, opt, {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_console: true,
          },
        },
        sourceMap: true,
      }),
    ],
  });
}

webpackConfig.entry = {
  app: __LOCAL__
    ? [APP_ENTRY].concat(
        `webpack-hot-middleware/client?path=${project.compiler_public_path}__webpack_hmr`
      )
    : [APP_ENTRY],
  vendor: project.compiler_vendors,
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: __LOCAL__
    ? '[name].js'
    : `[name][${project.compiler_hash_type}].js`,
  path: project.paths.dist(),
  publicPath: project.compiler_public_path,
};

// ------------------------------------
// Externals
// ------------------------------------
webpackConfig.externals = {};
webpackConfig.externals['react/lib/ExecutionEnvironment'] = true;
webpackConfig.externals['react/lib/ReactContext'] = true;
webpackConfig.externals['react/addons'] = true;

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(project.globals),
  new HtmlWebpackPlugin({
    template: project.paths.client('index.html'),
    hash: false,
    favicon: project.paths.public('favicon.ico'),
    filename: 'index.html',
    inject: false,
    chunksSortMode: 'manual',
    minify: {
      collapseWhitespace: true,
    },
    chunks: ['vendor', 'app'],
    environment: process.env.NODE_ENV,
  }),
  new HappyPack({
    id: 'happyBabel',
    loaders: [
      {
        loader: 'babel-loader',
        cacheDirectory: true,
      },
    ],
    threadPool: happyThreadPool,
    verboseWhenProfiling: true,
  }),
];

if (__LOCAL__) {
  debug('Enabling plugins for live development (HMR).');
  // webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfig.plugins.push(
    new AddAssetHtmlPlugin({
      filepath: require.resolve('../dll/vendor.dll.js'),
      includeSourcemap: false,
    })
  );
  webpackConfig.plugins.push(
    new webpack.DllReferencePlugin({
      manifest: path.join(__dirname, '../dll/manifest.json'),
    })
  );
}

if (__ONLINE__) {
  webpackConfig.plugins.push(
    new SentryWebpackPlugin({
      ignore: ['../node_modules', 'webpack.config.js'],
      include: './build',
    })
  );
}

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: 'happypack/loader?id=happyBabel',
});

// run eslint in dev
if (__LOCAL__) {
  webpackConfig.module.rules.push({
    enforce: 'pre',
    test: /\.(js|jsx)$/,
    include: path.join(__dirname, '../src'),
    loader: 'eslint-loader',
  });
}

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
const cssExtraLoader = ['css-hot-loader', MiniCssExtractPlugin.loader];

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
        removeAll: true,
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
      sourcemap: false,
    },
  },
};

webpackConfig.module.rules.push({
  test: /\.css$/,
  use: [...cssExtraLoader, cssLoader],
});

webpackConfig.module.rules.push({
  test: /\.less$/,
  use: [
    ...cssExtraLoader,
    cssLoader,
    {
      loader: 'less-loader',
      options: {
        modifyVars: {
          '@primary-color': '#178bfb',
          '@icon-url': '"/iconfont/iconfont"',
        },
      },
    },
  ],
});

webpackConfig.module.rules.push({
  test: /\.(sass|scss)$/,
  use: [
    ...cssExtraLoader,
    cssLoader,
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: '@epegzz/sass-vars-loader',
      options: {
        vars: {
          'primary-color': '#178bfb',
        },
      },
    },
  ],
});

webpackConfig.plugins.push(
  new MiniCssExtractPlugin({
    filename: __LOCAL__ ? '[name].css' : '[name][contenthash].css',
    chunkFilename: __LOCAL__ ? '[id].css' : '[id][contenthash].css',
  })
);

// Images
// ------------------------------------
webpackConfig.module.rules.push({
  test: /\.(png|jpg|gif)$/,
  loader: 'url-loader',
  options: {
    limit: 8192,
  },
});

// Fonts
// ------------------------------------
[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  ['svg', 'image/svg+xml'],
].forEach(font => {
  const extension = font[0];
  const mimetype = font[1];

  webpackConfig.module.rules.push({
    test: new RegExp(`\\.${extension}$`),
    loader: 'url-loader',
    options: {
      name: 'fonts/[name].[ext]',
      limit: 10000,
      mimetype,
    },
  });
});

module.exports = webpackConfig;
