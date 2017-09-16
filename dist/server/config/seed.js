/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = seedDatabaseIfNeeded;

var _thing = require('../api/thing/thing.model');

var _thing2 = _interopRequireDefault(_thing);

var _user = require('../api/user/user.model');

var _user2 = _interopRequireDefault(_user);

var _environment = require('./environment/');

var _environment2 = _interopRequireDefault(_environment);

var _task = require('../api/task/task.model');

var _task2 = _interopRequireDefault(_task);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function seedDatabaseIfNeeded() {
  if (_environment2.default.seedDB) {
    // User.find({}).remove()
    //   .then(() => {
    //     User.create({
    //       provider: 'local',
    //       role: 'admin',
    //       name: 'Admin',
    //       email: 'studentrelations@shaastra.org',
    //       password: 'admin'
    //     })
    //     .then(() => console.log('finished populating users'))
    //     .catch(err => console.log('error populating users', err));
    //   });
  }
}
//# sourceMappingURL=seed.js.map
