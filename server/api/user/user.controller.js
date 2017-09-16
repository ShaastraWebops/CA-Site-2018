'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
var json2csv = require('json2csv');
var request = require("request");
var crypto = require('crypto');

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

export function list(req, res) {
  return User.find({}, '-salt -password -provider -role').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

export function exp(req, res) {
  return User.find({}, '-_id -salt -password -provider -role').exec()
    .then(users => {
      var fields = ['name', 'email', 'college.address', 'college.city', 'college.name', 'college.state',
      'education.branch', 'education.degree', 'education.year', 'phonenumber', 'previous', 'prevyear',
      'postal.address', 'postal.city', 'postal.pin', 'postal.state', 'questions.past', 'questions.right',
      'questions.why', 'social', 'wnumber', 'fblink'];
      var csv = json2csv({ data: users, fields: fields});
      res.setHeader('Content-disposition', 'attachment; filename=users.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csv);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  return newUser.save()
    .then(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      var options = { method: 'POST',
        url: 'https://api.sendgrid.com/v3/mail/send',
        headers:
         { 'content-type': 'application/json',
           authorization: 'Bearer ' + process.env.CASITE },
        body:
        { personalizations:
           [ { to: [ { email: user.email, name: 'Akshay' } ],
               subject: 'Shaastra 2018 || Campus Ambassador' } ],
          from: { email: 'studentrelations@shaastra.org', name: 'Student Relations, Shaastra' },
          //reply_to: { email: 'sam.smith@example.com', name: 'Sam Smith' },
          subject: 'Shaastra 2018 || Campus Ambassador',
          content:
           [ { type: 'text/html',
               value: '<html><body><p>Hello '+user.name+ ',<br>Greetings from Shaastra 2018, IIT Madras! <br><br>Thank you for signing up for the Shaastra Campus Ambassador Program. Please complete the questionnaire on the portal by 25th August 2017.<br> You will be intimidated by mail if you are selected to become a Campus Ambassador. Meanwhile please like and follow our Facebook page: fb.com/Shaastra for updates.<br> If you have any queries contact us on studentrelations@shaastra.org <br><br><br>Regards, <br>Team Shaastra <br> IIT Madras</p></body></html>' } ] },
        json: true };

        request(options, function (error, response, body) {
    if (error) throw new Error(error);

    //console.log(response);
  });
    res.json({ token });
    })
    .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

export function submit(req, res) {
  return User.findById(req.user._id).exec()
    .then(user => {
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
      return user.save()
        .then(() => {
          res.json({success: true});
        })
        .catch(handleError(res));
    });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

export function select(req, res) {
  return User.findById(req.params.id).exec()
    .then(function(user) {
      if(!user)
      {
        res.json({success: false,message: "No User found"});
      }
      else{
      user.selected=1;
      return user.save()
        .then(() => {
          var options = { method: 'POST',
            url: 'https://api.sendgrid.com/v3/mail/send',
            headers:
             { 'content-type': 'application/json',
               authorization: 'Bearer ' + process.env.CASITE },
            body:
            { personalizations:
               [ { to: [ { email: user.email, name: 'Akshay' } ],
                   subject: 'Shaastra 2018 || Campus Ambassador' } ],
              from: { email: 'studentrelations@shaastra.org', name: 'Student Relations, Shaastra' },
              //reply_to: { email: 'sam.smith@example.com', name: 'Sam Smith' },
              subject: 'Shaastra 2018 || Campus Ambassador',
              content:
               [ { type: 'text/html',
                   value: '<html><body><p>Hello ' +user.name+ ',<br><br> Greetings from Shaastra 2018, IIT Madras! <br><br>First of all, congratulations on being selected as a Campus Ambassador for your college. We would like to welcome you to the team behind India’s largest completely student-run technical extravaganza - Shaastra 2018.<br>With a strong team of 500 students of IIT Madras and hundreds of Campus Ambassadors across India, Shaastra 2018 aims to give the best technical experience to everyone in the country ranging from school students to engineers of the future.<br>With this in mind, we hope you have an amazing journey working with us as you represent your college.<br>Further instructions and information would be communicated to you shortly. We request you to keep checking the CA Portal as well as your email.<br><br>Looking forward to work with you.<br><br>Regards,<br>Team Shaastra<br>IIT Madras</p></body></html>' } ] },
            json: true };

            request(options, function (error, response, body) {
        if (error) throw new Error(error);

        //console.log(response);
      });
          res.json({success: true, message: "User updated"});
        })
        .catch(handleError(res));
     }
    })
    .catch(handleError(res));
}

export function reject(req, res) {
  return User.findById(req.params.id).exec()
    .then(function(user) {
      if(!user)
      {
        res.status(400).json({message: "No User found"});
      }
      else{
      user.selected=2;
      var name=user.name,email=user.email;
      return user.save()
        .then(() => {
          var options = { method: 'POST',
            url: 'https://api.sendgrid.com/v3/mail/send',
            headers:
             { 'content-type': 'application/json',
               authorization: 'Bearer ' + process.env.CASITE },
            body:
            { personalizations:
               [ { to: [ { email: user.email, name: 'Akshay' } ],
                   subject: 'Shaastra 2018 || Campus Ambassador' } ],
              from: { email: 'studentrelations@shaastra.org', name: 'Student Relations, Shaastra' },
              //reply_to: { email: 'sam.smith@example.com', name: 'Sam Smith' },
              subject: 'Shaastra 2018 || Campus Ambassador',
              content:
               [ { type: 'text/html',
                   value: '<html><body><p>Hello '+user.name+ ',<br><br> Greetings from Shaastra 2018, IIT Madras! <br><br>We regret to inform you that your application for being a Shaastra Campus Ambassador couldn’t be accommodated. However, lose hope not, for you can try again for next year - which will see a bigger CA Program.<br>Till then, get a feel of Shaastra - visit the IIT Madras campus in January and experience the largest student-run technical extravaganza. With a host of workshops, international competitions, lectures, exhibitions and shows, Shaastra is bound to amaze you.<br><br>We look forward to see you at Shaastra 2018, and as a Campus Ambassador next year!<br><br>Regards,<br>Team Shaastra<br>IIT Madras</p></body></html>' } ] },
            json: true };

            request(options, function (error, response, body) {
        if (error) throw new Error(error);

        //console.log(response);
      });
          res.status(200).json({message: "User updated"});
        })
        .catch(handleError(res));
     }
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
      return ;
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}

export function forgotPassword (req, res, next) {
  console.log("Came here forgot password");
  crypto.randomBytes(25, (err, buf) => {
    if(err) { return handleError(res, err); }
    var token = buf.toString('hex');
    // console.log("token : ",token, " \n mail", req.body.email);
    User.findOne({ email: req.body.email }).then( (user, err)=> {
      if(err) { 
        return handleError(res, err); }
      if(!user) { 
        return res.status(404).end(); }
  console.log("Came here user find", user.name);

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 1800000; // half an hour to reset
      user.save()
        .then(user => { 
  console.log("Came here user.save",user.name);

          var options = { method: 'POST',
            url: 'https://api.sendgrid.com/v3/mail/send',
            headers:
             { 'content-type': 'application/json',
               authorization: 'Bearer ' + process.env.CASITE },
            body:
            { personalizations:
               [ { to: [ { email: user.email, name: user.name } ],
                   subject: 'Shaastra 2018 || Campus Ambassador' } ],
              from: { email: 'support@shaastra.org', name: 'Student Relations, Shaastra' },
              //reply_to: { email: 'sam.smith@example.com', name: 'Sam Smith' },
              subject: 'Shaastra 2018 || Campus Ambassador',
              content:
               [ { type: 'text/html',
                   value: "<table style=\"background-color: #f3f3f3; font-family: verdana, tahoma, sans-serif; color: black; padding: 30px;\">" +
                    "<tr> <td>" +
                    "<h2>Hello " + user.name + ",</h2>" +
                    "<p>Greetings from Shaastra-2017 team.</p>" +
                    "<p>You have received this email since you have requested for password change for your Shaastra account.</p>" +
                    "<p>Please click on the following link, or paste this into your browser to complete the process:" +
                    "<p> ca.shaastra.org/resetpassword/" + user.email + "/" + token + "</p>" +
                    // "<p>http://shaastra.org/#/reset-password/" + token + "</p>" +
                    "<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>" +
                    "Best,<br/> Shaastra 2017 team</p> </td> </tr> </table>" } ] },
            json: true };

          request(options, function (error, response, body) {
            if (error) throw new Error(error);
          console.log("Came here req body");
          return res.json({success: true, message: 'Password Reset Mail Sent to' + req.body.email});

          //console.log(response);
          });
        }); //user.save()
      }); //user.find()
    }) //random bytes
 //random bytes
 return ;
  } //forget password

/**
 * Resets the password of the user
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
export function resetPassword(req, res) {
  console.log("reset password\n\n",req.params);
  // console.log(req.body.newPassword);//Severe Breach of Security Not me :P

  User.findOne({ resetPasswordToken: req.params.token, email:req.params.email, resetPasswordExpires: { $gt: Date.now() } }).then((user, err)=>{
  // User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).then((err, user)=>{

      console.log("\n user", user,"\nerr ",err)
      if(err) { return handleError(res, err); }
      if(!user) {
       console.log("err !user reset password", user);
       return res.sendStatus(404); }
      console.log("no error in findone");
      user.password = req.body.newPassword;
      user.resetPasswordToken = '';
      // user.updatedOn = Date.now();


      user.save().then((user)=>{
        console.log("save pass err",err,"user,",user);
        if(err) { return handleError(res, err); }
          var options = { method: 'POST',
            url: 'https://api.sendgrid.com/v3/mail/send',
            headers:
             { 'content-type': 'application/json',
               authorization: 'Bearer ' + process.env.CASITE },
            body:
            { personalizations:
               [ { to: [ { email: user.email, name: user.name } ],
                   subject: 'Shaastra 2018 || Campus Ambassador' } ],
              from: { email: 'support@shaastra.org', name: 'Student Relations, Shaastra' },
              //reply_to: { email: 'sam.smith@example.com', name: 'Sam Smith' },
              subject: 'Shaastra 2018 || Campus Ambassador',
              content:
               [ { type: 'text/html',
                   value: "<table style=\"background-color: #f3f3f3; font-family: verdana, tahoma, sans-serif; color: black; padding: 30px;\">" +
                    "<tr> <td>" +
                    "<h2>Hello " + user.name + ",</h2>" +
                    "<p>Greetings from Shaastra-2017 team.</p>" +
                    "<p>This is a confirmation that the password for your account <b>" + user.email + "</b> has just been changed</p>" +
                    "Best,<br/> Shaastra 2017 team</p> </td> </tr> </table>" } ] },
            json: true };

          request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log("\n\nEnd of reset");
            return res.json({success: true, message: 'successfully changed Password'});

          //console.log(response);
          });
      }); //User.save();

  });
  return ;
}