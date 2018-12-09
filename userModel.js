var mongoose = require('mongoose');
var schema = new mongoose.Schema(
  {  username: String,
  }, { versionKey: false }
);
var User = mongoose.model('user', schema);
module.exports= User;

//mongoose.Types.ObjectId
