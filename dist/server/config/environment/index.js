'use strict';
/*eslint no-process-env:0*/

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: _path2.default.normalize(__dirname + '/../../..'),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3001,

  // Server port
  port: process.env.PORT || 9010,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'caportal-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID: '1363769900374546', //process.env.FACEBOOK_ID || 'id',
    clientSecret: 'c557453c8a4dd8ad7e4bff237d286069', //process.env.FACEBOOK_SECRET || 'secret',
    callbackURL: 'http://localhost:3000/auth/facebook/callback' //`${process.env.DOMAIN || ''}/auth/facebook/callback`
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _lodash2.default.merge(all, require('./shared'), require('./' + process.env.NODE_ENV + '.js') || {});
//# sourceMappingURL=index.js.map
