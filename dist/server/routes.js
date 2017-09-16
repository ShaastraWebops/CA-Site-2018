/**
 * Main application routes
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app) {

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT"); //if any error comes Access-Control-Allow-Methods not given or so, just add it here
    next();
  });
  // Insert routes below
  app.use('/api/citys', require('./api/city'));
  app.use('/api/uploads', require('./api/upload'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/tasks', require('./api/task'));
  app.use('/auth', require('./auth').default);

  app.get('/image/:url', function (req, res) {
    if (req.params.url === "Noname") {
      res.send("No File Uploaded  ");
    }
    res.sendFile(_path2.default.resolve('./client/assets/uploads/' + req.params.url));
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(_errors2.default[404]);

  // All other routes should redirect to the index.html
  app.route('/*').get(function (req, res) {
    res.sendFile(_path2.default.resolve(app.get('appPath') + '/index.html'));
  });
};

var _errors = require('./components/errors');

var _errors2 = _interopRequireDefault(_errors);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=routes.js.map
