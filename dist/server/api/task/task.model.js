'use strict';
/*eslint no-invalid-this:0*/

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../user/user.model');

var _user2 = _interopRequireDefault(_user);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = require('bluebird');


var TaskSchema = new _mongoose.Schema({
  title: String,
  description: String,
  deadline: {
    month: String,
    day: Number,
    year: Number
  },
  points: Number,
  files: [String],
  pending: [{ type: _mongoose.Schema.Types.ObjectId, ref: 'User'
  }],
  approved: [{ type: _mongoose.Schema.Types.ObjectId, ref: 'User'
  }],
  rejected: [{ type: _mongoose.Schema.Types.ObjectId, ref: 'User'
  }]
});

/**
 * Virtuals
 */

// Public profile information

exports.default = _mongoose2.default.model('Task', TaskSchema);
//# sourceMappingURL=task.model.js.map
