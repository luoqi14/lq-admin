/* eslint-disable global-require */
const express = require('express');
const debug = require('debug')('app:server');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config');
const project = require('../config/project.config');
const compress = require('compression');
const bodyParser = require('body-parser');
// import { renderToString } from 'react-dom/server'
// import React from 'react'
// import { createStore } from 'redux'
// import { Provider } from 'react-redux'
// import makeRootReducer from '../src/store/reducers'
// import AppContainer from '../src/containers/AppContainer'

const app = express();

// app.use(handleRender)

// function handleRender (req, res) {
//   // 创建新的 Redux store 实例
//   const store = createStore(makeRootReducer())
//
//   // 把组件渲染成字符串
//   const html = renderToString(
//     <Provider store={store}>
//       <AppContainer />
//     </Provider>
//   )
//
//   // 从 store 中获得初始 state
//   const preloadedState = store.getState()
//
//   // 把渲染后的页面内容发送给客户端
//   res.send(renderFullPage(html, preloadedState))
// }
//
// function renderFullPage (html, preloadedState) {
//   return `
//     <!doctype html>
//     <html>
//       <head>
//         <title>Redux Universal Example</title>
//       </head>
//       <body>
//         <div id="root">${html}</div>
//         <script>
//           window.__INITIAL_STATE__ = ${JSON.stringify(preloadedState)}
//         </script>
//         <script src="/static/bundle.js"></script>
//       </body>
//     </html>
//     `
// }

// Apply gzip compression
app.use(compress());

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (project.env === 'local') {
  const compiler = webpack(webpackConfig);

  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true,
  }));

  // allow custom header and CORS
  app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
      'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
      res.send(200);
    } else {
      setTimeout(() => {
        next();
      }, Math.random() * 500);
    }
  });

  const users = require('./mock/users');

  app.use('/users', users);

  debug('Enabling webpack dev and HMR middleware');
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath  : webpackConfig.output.publicPath,
    contentBase : project.paths.client(),
    hot         : true,
    quiet       : project.compiler_quiet,
    noInfo      : project.compiler_quiet,
    lazy        : false,
    stats       : project.compiler_stats,
  }));
  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr',
  }));

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of local since this directory will be copied into ~/build
  // when the application is compiled.
  app.use(express.static(project.paths.public()));

  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement universal
  // rendering, you'll want to remove this middleware.
  app.use('*', (req, res, next) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
      return undefined;
    });
  });
} else {
  debug(
    'Server is being run outside of live local mode, meaning it will ' +
    'only serve the compiled application bundle in ~/build. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  );

  // Serving ~/build by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(project.paths.dist()));
}

module.exports = app;
