const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require("lodash");
const mongoose=require("mongoose");
const https=require("https");

mongoose.connect("mongodb+srv://anshpanda09:anshuman123@cluster0-pjrht.mongodb.net/contentDB?retryWrites=true&w=majority",{useNewUrlParser: true,useUnifiedTopology: true});

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//var posts=[];
//var post={};
const postSchema={
  tittle:String,
  body:String
};
const Post=mongoose.model("Post",postSchema);



app.get("/",function(req,res)
{
  Post.find({},function(err,foundItems){
    if(!err){
      res.render("home",{
        line1:homeStartingContent,
        posts:foundItems

      });
    }

  });

});

app.get('/about',function(req,res){
  res.render("about",{
    content:aboutContent
  });
});

app.get("/contact",function(req,res){
  res.render("contact",{
    contact:contactContent
  });
});

app.get('/compose',function(req,res){
  res.render("compose");
});


app.post("/compose",function(req,res){


   var post= new Post({
  tittle:req.body.tittle,
  body:req.body.body
});

 var requestedItems=_.lowerCase(req.body.tittle);
Post.findOne({tittle:req.body.tittle},function(err,foundItems){
  if(!err)
  {
    if(!foundItems){
      post.save();
    }
  }
});

res.redirect("/");


});

app.get("/posts/:postName",function(req,res){
  var reqTittle=_.lowerCase(req.params.postName);
  posts.forEach(function(post){
    var storedTittle=_.lowerCase(post.tittle);
    if(storedTittle=== reqTittle){
    res.render("post",{
      tittle:post.tittle,
      content:post.body
    })  ;
    }
  });
});

app.post("/delete",function(req,res){
  topic=req.body.button;
  Post.deleteOne({tittle:topic},function(err){
    if(err){
      console.log(err);
    }
  });
  res.redirect("/");

});













app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
