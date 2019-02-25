/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path');
const debug = require('debug')('app:config:project');
const argv = require('yargs').argv;
const ip = require('ip');

debug('Creating default configuration.');
// ========================================================
// Default Configuration
// ========================================================
const config = {
  env : process.env.NODE_ENV || 'local',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '..'),
  dir_client : 'src',
  dir_dist   : 'build',
  dir_public : 'public',
  dir_server : 'server',
  dir_test   : 'tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : ip.address(), // use string 'localhost' to prevent exposure on local network
  server_port : argv.PORT || 3000,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_devtool         : 'cheap-module-eval-source-map',
  compiler_hash_type       : 'hash',
  compiler_fail_on_warning : false,
  compiler_quiet           : false,
  compiler_public_path     : '/',
  compiler_stats           : 'minimal',
  // compiler_stats           : {
  //   chunks : false,
  //   chunkModules : false,
  //   colors : true,
  // },
  compiler_vendors : [
    'react',
    'react-dom',
    'react-redux',
    'react-router-dom',
    'redux',
  ],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_reporters : [
    { type : 'text-summary' },
    { type : 'lcov', dir : 'coverage' },
  ],
};

/************************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
let env = config.env;
if (env === 'online' || env === 'pre' || env === 'qaif' || env === 'qafc' || env === 'dev') {
  env = 'production'; // uat or release(give to QA) is the same as production except the uat api address
}

config.globals = {
  'process.env'  : {
    // NODE_ENV : JSON.stringify(env),
    version: JSON.stringify(process.env.npm_package_version || ''),
  },
  NODE_ENV        : config.env,
  __ONLINE__      : config.env === 'online',
  __PRE__         : config.env === 'pre',
  __QAIF__        : config.env === 'qaif',
  __QAFC__        : config.env === 'qafc',
  __DEV__         : config.env === 'dev',
  __LOCAL__ : config.env === 'local',
  __COVERAGE__    : !argv.watch && config.env === 'test',
  __BASENAME__    : JSON.stringify(process.env.BASENAME || ''),
  __MOCK__ : process.env.MOCK || false,
  __TEST__ : config.env === 'test',
};

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json');

config.compiler_vendors = config.compiler_vendors
  .filter((dep) => {
    if (pkg.dependencies[dep]) return true;

    debug(`Package "${dep}" was not found as an npm dependency in package.json;
       it won't be included in the webpack vendor bundle.
       Consider removing it from \`compiler_vendors\` in ~/config/index.js`);
    return undefined;
  });

// ------------------------------------
// Utilities
// ------------------------------------
function base(...rest) {
  const args = [config.path_base].concat(rest);
  return path.resolve(...args);
}

config.paths = {
  base,
  client : base.bind(null, config.dir_client),
  public : base.bind(null, config.dir_public),
  dist   : base.bind(null, config.dir_dist),
};

// ========================================================
// Environment Configuration
// ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`);
const environments = require('./environments.config');

const overrides = environments[config.env];
if (overrides) {
  debug('Found overrides, applying to default configuration.');
  Object.assign(config, overrides(config));
} else {
  debug('No environment overrides found, defaults will be used.');
}

module.exports = config;
