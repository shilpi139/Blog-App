var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));

//lets define configuration of database
var dbPath = "mongodb://localhost/blogDb";
//connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {
  console.log("database connection opened successfully");
});

//include the model file
var Blog = require('./blogModel.js');
var blogModel = mongoose.model('blog');

//middlewares
app.use(function(req,res,next){
  console.log("Time and Date Log ",new Date());
  console.log("Request Url Log ",req.originalUrl);
  console.log("Request Method Log ",req.method);
  console.log("Request Ip address Log ",req.ip);
  next();
});


//start route to get all blogs
app.get('/', function (req, res) {
  res.send("Welcome to the blog page.")
});

//GET : fetch all blogs
app.get('/blogs', function(req, res) {
    blogModel.find(function(err, result) {
      if(err) {
        res.send(err);
      }else {
        res.send(result);
      }
    });
});

// GET : ,Retrieve a particular blog on the basis of _id
app.get('/blogs/:id', function(req, res) {
    blogModel.findOne({'_id' : req.params.id}, function(err, result) {
      if(err) {
        res.send(err);
      }else {
        res.send(result);
      }
    });
});

//POST :  Create a new blog
app.post('/blog/create',function(req, res) {
    var newBlog = new blogModel({
      title     : req.body.title,
      subTitle  : req.body.subTitle,
      blogBody  : req.body.blogBody
    }); 

    //Present date
    newBlog.created = Date.now();

    // author
    var author = {firstName : req.body.firstName, lastName : req.body.lastName, email : req.body.email};
    newBlog.author = author;

    //tags
    var blogTags = (req.body.blogTags!=undefined && req.body.blogTags!=null)?req.body.blogTags.split(','):''
    newBlog.tags = blogTags; 

    newBlog.save(function(err){
      if(err){
        console.log(err, "something is not working");
        res.send(err);
      }else{
        res.send(newBlog);
      }
    });
});

// PUT : Edit a particular blog on the basis of _id defined
app.put('/blogs/:id/edit', function(req, res) {
    var update = req.body;
    //since tag is an array, so have to again do changes before saving in database
    var blogTags = (req.body.blogTags!=undefined && req.body.blogTags!=null)?req.body.blogTags.split(','):''
    update.tags = blogTags; 
    blogModel.findOneAndUpdate({'_id' : req.params.id}, update , function(err, result) {
      if(err) {
        res.send(err);
      }else {
        res.send(result);
      }
    });
});

//  delete a blog
app.post('/blogs/:id/delete',function(req, res) {
    blogModel.remove({'_id':req.params.id},function(err,result){
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    });
});

///any route not handled by the application is handled here which will give 404 Not found
app.use(function(req, res) {
   res.status('404').send("404 Page not Found");
   console.log("Page not found");
});

var server = app.listen(3000, function() {
  var port = server.address().port;
  console.log('Blog App listening on port %s.', port);
}); 
