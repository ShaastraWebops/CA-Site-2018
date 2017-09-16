'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.apply = apply;
exports.getusers = getusers;
exports.show = show;
exports.gettasks = gettasks;
exports.reject = reject;
exports.approve = approve;

var _task = require('./task.model');

var _task2 = _interopRequireDefault(_task);

var _user = require('../user/user.model');

var _user2 = _interopRequireDefault(_user);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */

/**
 * Creates a new user
 */
function create(req, res) {
  var newTask = new _task2.default(req.body);
  newTask.save().then(function () {
    res.json({ success: true, message: 'New Task Created' });
  }).catch(validationError(res));
}

function apply(req, res) {
  var userid = req.user._id;
  var taskid = req.params.id;
  var error = false;
  return _task2.default.findById(taskid).exec().then(function (task) {
    if (!task) {
      return res.json({ success: false, message: "No such task available" });
    }
    _task2.default.update({ _id: taskid }, { $addToSet: { pending: userid } }, function (err, msg) {
      if (err) throw err;
      if (msg.nModified == 0) //1 in console
        {
          res.json({ success: false, message: 'Already applied' });
        } else {
        res.json({ success: true, message: 'Applied' });
      }
    });
  });
}

function getusers(req, res) {

  var id = req.params.id;
  _user2.default.find({ 'files.taskid': id }).exec().then(function (users) {
    if (!users) {
      res.json({ success: false, message: "Users no longer exists" });
    } else {
      res.json({ success: true, users: users });
    }
  }).catch(handleError(res));
}

function show(req, res) {
  var taskId = req.params.id;

  return _task2.default.findById(taskId).exec().then(function (task) {
    if (!task) {
      return res.status(404);
    }
    res.json({ success: true, task: task });
  }).catch(handleError(res));
}

function gettasks(req, res) {

  var userid = req.user._id;
  _task2.default.find({}).populate('approved').exec().then(function (tasks) {
    res.status(200).json({ tasks: tasks, userid: userid });
  }).catch(handleError(res));
}

function reject(req, res) {

  var taskId = req.params.id;
  var userid = req.body.userid;

  _task2.default.findById(taskId).exec().then(function (task) {
    if (!task) {
      return res.json({ success: false, msg: 'no such task exists!' });
    }
    _task2.default.update({ _id: taskId }, { $addToSet: { rejected: userid } }, function (err, msg) {
      if (err) throw err;
      if (msg.nModified == 0) {
        res.json({ success: false, msg: 'Already rejected!' });
      } else {
        _task2.default.update({ '_id': taskId }, { $pull: { 'approved': _mongoose2.default.Types.ObjectId(userid) } }, function (err, msg) {
          if (err) throw err;
          res.json({ success: true, msg: "Rejected!" });
        });
      }
    });
  });
}

function approve(req, res) {

  var taskId = req.params.id;
  var userid = req.body.userid;

  _task2.default.findById(taskId).exec().then(function (task) {
    if (!task) {

      return res.json({ success: false, msg: "no such task exists!" });
    }
    var points = task.points;
    _task2.default.update({ _id: taskId }, { $addToSet: { approved: userid } }, function (err, msg) {

      if (err) throw err;
      if (msg.nModified == 0) {

        res.json({ success: false, msg: 'Already approved!' });
      } else {
        _user2.default.update({ _id: userid }, { $inc: { points: points } }, function (err, msg) {

          if (err) throw err;
        });
        _task2.default.update({ '_id': taskId }, { $pull: { 'rejected': _mongoose2.default.Types.ObjectId(userid) } }, function (err, msg) {
          if (err) throw err;
          res.json({ success: true, msg: "Approved!" });
        });
      }
    });
  });
}
//# sourceMappingURL=task.controller.js.map
