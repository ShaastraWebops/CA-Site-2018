'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.list = list;
exports.exp = exp;
exports.create = create;
exports.show = show;
exports.submit = submit;
exports.destroy = destroy;
exports.select = select;
exports.reject = reject;
exports.changePassword = changePassword;
exports.me = me;
exports.authCallback = authCallback;

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var json2csv = require('json2csv');
var request = require("request");

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
function index(req, res) {
  return _user2.default.find({}, '-salt -password').exec().then(function (users) {
    res.status(200).json(users);
  }).catch(handleError(res));
}

function list(req, res) {
  return _user2.default.find({}, '-salt -password -provider -role').exec().then(function (users) {
    res.status(200).json(users);
  }).catch(handleError(res));
}

function exp(req, res) {
  return _user2.default.find({}, '-_id -salt -password -provider -role').exec().then(function (users) {
    var fields = ['name', 'email', 'college.address', 'college.city', 'college.name', 'college.state', 'education.branch', 'education.degree', 'education.year', 'phonenumber', 'previous', 'prevyear', 'postal.address', 'postal.city', 'postal.pin', 'postal.state', 'questions.past', 'questions.right', 'questions.why', 'social', 'wnumber', 'fblink'];
    var csv = json2csv({ data: users, fields: fields });
    res.setHeader('Content-disposition', 'attachment; filename=users.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);
  }).catch(handleError(res));
}

/**
 * Creates a new user
 */
function create(req, res) {
  var newUser = new _user2.default(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  return newUser.save().then(function (user) {
    var token = _jsonwebtoken2.default.sign({ _id: user._id }, _environment2.default.secrets.session, {
      expiresIn: 60 * 60 * 5
    });
    var options = { method: 'POST',
      url: 'https://api.sendgrid.com/v3/mail/send',
      headers: { 'content-type': 'application/json',
        authorization: 'Bearer ' + process.env.CASITE },
      body: { personalizations: [{ to: [{ email: user.email, name: 'Akshay' }],
          subject: 'Shaastra 2018 || Campus Ambassador' }],
        from: { email: 'studentrelations@shaastra.org', name: 'Student Relations, Shaastra' },
        //reply_to: { email: 'sam.smith@example.com', name: 'Sam Smith' },
        subject: 'Shaastra 2018 || Campus Ambassador',
        content: [{ type: 'text/html',
          value: '<html><body><p>Hello ' + user.name + ',<br>Greetings from Shaastra 2018, IIT Madras! <br><br>Thank you for signing up for the Shaastra Campus Ambassador Program. Please complete the questionnaire on the portal by 25th August 2017.<br> You will be intimidated by mail if you are selected to become a Campus Ambassador. Meanwhile please like and follow our Facebook page: fb.com/Shaastra for updates.<br> If you have any queries contact us on studentrelations@shaastra.org <br><br><br>Regards, <br>Team Shaastra <br> IIT Madras</p></body></html>' }] },
      json: true };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      //console.log(response);
    });
    res.json({ token: token });
  }).catch(validationError(res));
}

/**
 * Get a single user
 */
function show(req, res, next) {
  var userId = req.params.id;

  return _user2.default.findById(userId).exec().then(function (user) {
    if (!user) {
      return res.status(404).end();
    }
    res.json(user.profile);
  }).catch(function (err) {
    return next(err);
  });
}

function submit(req, res) {
  return _user2.default.findById(req.user._id).exec().then(function (user) {
    user.phonenumber = req.body.phonenumber;
    user.wnumber = req.body.wnumber;
    user.previous = req.body.previous;
    user.prevyear = req.body.prevyear;
    user.social = req.body.social;
    user.fblink = req.body.fblink;
    user.college.name = req.body.college.name;
    user.college.address = req.body.college.address;
    user.college.city = req.body.college.city;
    user.college.state = req.body.college.state;
    user.education.degree = req.body.education.degree;
    user.education.branch = req.body.education.branch;
    user.education.year = req.body.education.year;
    user.postal.address = req.body.postal.address;
    user.postal.city = req.body.postal.city;
    user.postal.state = req.body.postal.state;
    user.postal.pin = req.body.postal.pin;
    user.questions.why = req.body.questions.why;
    user.questions.right = req.body.questions.right;
    user.questions.past = req.body.questions.past;
    user.submitted = true;
    return user.save().then(function () {
      res.json({ success: true });
    }).catch(handleError(res));
  });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
function destroy(req, res) {
  return _user2.default.findByIdAndRemove(req.params.id).exec().then(function () {
    res.status(204).end();
  }).catch(handleError(res));
}

function select(req, res) {
  return _user2.default.findById(req.params.id).exec().then(function (user) {
    if (!user) {
      res.json({ success: false, message: "No User found" });
    } else {
      user.selected = 1;
      return user.save().then(function () {
        var options = { method: 'POST',
          url: 'https://api.sendgrid.com/v3/mail/send',
          headers: { 'content-type': 'application/json',
            authorization: 'Bearer ' + process.env.CASITE },
          body: { personalizations: [{ to: [{ email: user.email, name: 'Akshay' }],
              subject: 'Shaastra 2018 || Campus Ambassador' }],
            from: { email: 'studentrelations@shaastra.org', name: 'Student Relations, Shaastra' },
            //reply_to: { email: 'sam.smith@example.com', name: 'Sam Smith' },
            subject: 'Shaastra 2018 || Campus Ambassador',
            content: [{ type: 'text/html',
              value: '<html><body><p>Hello ' + user.name + ',<br><br> Greetings from Shaastra 2018, IIT Madras! <br><br>First of all, congratulations on being selected as a Campus Ambassador for your college. We would like to welcome you to the team behind India’s largest completely student-run technical extravaganza - Shaastra 2018.<br>With a strong team of 500 students of IIT Madras and hundreds of Campus Ambassadors across India, Shaastra 2018 aims to give the best technical experience to everyone in the country ranging from school students to engineers of the future.<br>With this in mind, we hope you have an amazing journey working with us as you represent your college.<br>Further instructions and information would be communicated to you shortly. We request you to keep checking the CA Portal as well as your email.<br><br>Looking forward to work with you.<br><br>Regards,<br>Team Shaastra<br>IIT Madras</p></body></html>' }] },
          json: true };

        request(options, function (error, response, body) {
          if (error) throw new Error(error);

          //console.log(response);
        });
        res.json({ success: true, message: "User updated" });
      }).catch(handleError(res));
    }
  }).catch(handleError(res));
}

function reject(req, res) {
  return _user2.default.findById(req.params.id).exec().then(function (user) {
    if (!user) {
      res.status(400).json({ message: "No User found" });
    } else {
      user.selected = 2;
      var name = user.name,
          email = user.email;
      return user.save().then(function () {
        var options = { method: 'POST',
          url: 'https://api.sendgrid.com/v3/mail/send',
          headers: { 'content-type': 'application/json',
            authorization: 'Bearer ' + process.env.CASITE },
          body: { personalizations: [{ to: [{ email: user.email, name: 'Akshay' }],
              subject: 'Shaastra 2018 || Campus Ambassador' }],
            from: { email: 'studentrelations@shaastra.org', name: 'Student Relations, Shaastra' },
            //reply_to: { email: 'sam.smith@example.com', name: 'Sam Smith' },
            subject: 'Shaastra 2018 || Campus Ambassador',
            content: [{ type: 'text/html',
              value: '<html><body><p>Hello ' + user.name + ',<br><br> Greetings from Shaastra 2018, IIT Madras! <br><br>We regret to inform you that your application for being a Shaastra Campus Ambassador couldn’t be accommodated. However, lose hope not, for you can try again for next year - which will see a bigger CA Program.<br>Till then, get a feel of Shaastra - visit the IIT Madras campus in January and experience the largest student-run technical extravaganza. With a host of workshops, international competitions, lectures, exhibitions and shows, Shaastra is bound to amaze you.<br><br>We look forward to see you at Shaastra 2018, and as a Campus Ambassador next year!<br><br>Regards,<br>Team Shaastra<br>IIT Madras</p></body></html>' }] },
          json: true };

        request(options, function (error, response, body) {
          if (error) throw new Error(error);

          //console.log(response);
        });
        res.status(200).json({ message: "User updated" });
      }).catch(handleError(res));
    }
  }).catch(handleError(res));
}

/**
 * Change a users password
 */
function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return _user2.default.findById(userId).exec().then(function (user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      return user.save().then(function () {
        res.status(204).end();
      }).catch(validationError(res));
    } else {
      return res.status(403).end();
    }
  });
}

/**
 * Get my info
 */
function me(req, res, next) {
  var userId = req.user._id;

  return _user2.default.findOne({ _id: userId }, '-salt -password').exec().then(function (user) {
    // don't ever give out the password or salt
    if (!user) {
      return res.status(401).end();
    }
    res.json(user);
  }).catch(function (err) {
    return next(err);
  });
}

/**
 * Authentication callback
 */
function authCallback(req, res) {
  res.redirect('/');
}
//# sourceMappingURL=user.controller.js.map
