'use strict';

var _express = require('express');

var _user = require('./user.controller');

var controller = _interopRequireWildcard(_user);

var _auth = require('../../auth/auth.service');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = new _express.Router();

router.get('/', controller.index);
router.get('/list', auth.hasRole('admin'), controller.list);
router.get('/export', auth.hasRole('admin'), controller.exp);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/submit', auth.isAuthenticated(), controller.submit);
router.put('/selected/:id', auth.hasRole('admin'), controller.select);
router.put('/rejected/:id', auth.hasRole('admin'), controller.reject);
router.post('/', controller.create);

module.exports = router;
//# sourceMappingURL=index.js.map
