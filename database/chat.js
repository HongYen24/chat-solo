var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chatSchema = new Schema({
  msgFrom : {type: String, default: "", required: true},
  msgTo : {type: String, default: "", required: true},
  msg : {type: String, default : ""},
  file : {type: String, default:""},
});
mongoose.model('chat',chatSchema);
