'use strict';

import jsonpatch from 'fast-json-patch';
import multer from 'multer';
import User from '../user/user.model';

var saveWithName = "Noname";
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'client/assets/uploads')
  },
  filename: function(req, file, cb) {

    saveWithName = file.fieldname + '-' + Date.now() + "." + file.originalname.split('.').pop();
    cb(null, saveWithName)
  }
});

var upload = multer({storage: storage}).single('uploadedFile');

export function uploadFile(req, res) {
  var task =  req.params.id;
  var user = req.user._id;
  upload(req, res, err => {

    if (err) {

      return res.json({success: false,  msg: "Error while uploading file", name: 'no file was uploaded'});
    }
    User.findOne({_id: user},function(err,user){
      if(err) throw err;
      user.files = user.files.concat({
        taskid: task,
        name: saveWithName
      });
      user.save(function(err){
        if(err) throw err;
        res.json({success: true, msg: "File Uploaded!", id: user._id});
      });
    });
  });
}
