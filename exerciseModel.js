var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema(
  {  userId: Schema.Types.ObjectId,
     description:String,
     duration:Number,
     date:{type:Date,default:Date.now}
  },{ versionKey: false }
);
var Exercise = mongoose.model('exercise', schema);
module.exports= Exercise;
//mongoose.Types.ObjectId
