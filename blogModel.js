// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var blogSchema = new Schema({
  title       : {type:String, default:'', required:true},
  subTitle    : {type:String, default:''},
  blogBody    : {type:String, default:''},
  author      : {},
  tags 		  : [],
  created_at  : {type:Date},
  updated_at  : {type:Date}
});

// the schema is useless so far
// we need to create a model using it
mongoose.model('blog', blogSchema);