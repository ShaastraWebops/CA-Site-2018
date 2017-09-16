'use strict';

var _express = require('express');

var _task = require('./task.controller');

var controller = _interopRequireWildcard(_task);

var _auth = require('../../auth/auth.service');

var auth = _interopRequireWildcard(_auth);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = new _express.Router();

router.post('/create', auth.hasRole('admin'), controller.create);
router.get('/getusers/:id', auth.hasRole('admin'), controller.getusers);
router.get('/gettasks', auth.isAuthenticated(), controller.gettasks);
router.put('/apply/:id', auth.isAuthenticated(), controller.apply);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.put('/approve/:id', auth.hasRole('admin'), controller.approve);
router.put('/reject/:id', auth.hasRole('admin'), controller.reject);

module.exports = router;
//# sourceMappingURL=index.js.map
