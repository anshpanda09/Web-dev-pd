const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require("lodash");
const mongoose=require("mongoose");
const https=require("https");
const bcrypt = require("bcrypt");
const saltsRound = 10;

mongoose.connect('mongodb+srv://anshpanda09:anshuman@cluster0.ilijj.mongodb.net/UserDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true  }).then(
    () => {
      console.log("Connected");
    },
    err => {
      console.log(err);
    }
);
//var x='';




const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res) =>{
  res.render("wlcome");
});
app.get("/sign-up",(req,res) =>{
  res.render("sign-up",{info:""});
});
app.get("/login",(req,res) =>{
  res.render("login");
});


const userSchema=new mongoose.Schema({
  username:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true,

  }
});
User=mongoose.model("User",userSchema);





app.post("/sign-up",(req,res)=>{
 let   usNameSign=req.body.usernameSignup;
  let passWordSign=req.body.passwordSignup;
  let len = passWordSign.length;
  if(len <6 && passWordSign===passWordSign.toLowerCase())
  {
    res.render("sign-up",{
      info:"Password length must be greater than 6 and must contains atleast one uppercse letter"
    });
  }
  else
  {
    //const query = User.where({username:usNameSign});
    User.findOne({username:usNameSign},(err,foundUser)=>{
      if(!err)
      {
        if(foundUser)
        {

          res.render("sign-up",{
            info:"The user name  already exists.Try another username."
          });

        }
        else
        {
          bcrypt.hash(passWordSign,saltsRound,function(err,hash){
            user1=new User({
              username:usNameSign,
              password:hash
            });
            user1.save(err =>{
              if(!err)
              res.redirect("login");
            });
          });
        }
      }
    });
  }
});

const dataSchema=new mongoose.Schema({
  name:String,
  title:{
    type:String,
    required:true
  },
  body:String
});

const Data=mongoose.model("Data",dataSchema);

newdata= new Data({
  name:"anshpanda09",
  title:"day1",
  body:"Hello anshpanda09"
});

//newdata.save();
var a=[];
var x='';
app.post("/login",(req,res) =>{
  var userNamelog=req.body.usernameLogin;

  var passWordlog=req.body.passwordLogin;
  //console.log(userNamelog);
 // console.log(passWordlog);
  User.findOne({username:userNamelog},(err,foundItem) =>{
    if(!err)
    {
      if(foundItem)
      {
        bcrypt.compare(passWordlog, foundItem.password ,function(err,result){
          if(result)
          {
            x=userNamelog;
            Data.find({name:userNamelog},(err,foundUsers) =>{
               if(!err)
               {
                 if(foundUsers)
                 {
                   a=foundUsers;
                   res.render("home",{
                     line1:homeStartingContent,
                     posts:foundUsers});
                 }
                 else{
                   var arr=[];
                   res.render("home",{posts:arr});
                 }
               }
            }) ;
          }
          else{
            console.log("Incorrect Password");
            res.redirect("login");
          }
        });

      }
      else{
        console.log("Invalid Username");
        res.redirect("login");
      }
    }
  });
});


app.get("/about",(req,res)=>{
  res.render("about",{
    content:aboutContent
  });
});


app.get("/contact",(req,res)=>{
  res.render("contact",{
    contact:contactContent
  });
});


app.get("/home",(req,res)=>{
  Data.find({name:x},(err,foundItems)=>{
    if(!err)
    {
      res.render("home",{
        line1:homeStartingContent,
        posts:foundItems
      });

    }
  })

});



app.get("/compose",(req,res) =>{
  res.render("compose");
});

app.post("/compose",(req,res)=>{
  var title=req.body.title;
  var body=req.body.body;
  post=new Data({
    name:x,
    title:title,
    body:body
  });
  post.save(err=>{
    if(!err)
    Data.find({name:x},(err,Items)=>{
      if(!err)
      {
        res.render("home",{
          line1:homeStartingContent,
          posts:Items
        });
      }
    });
  });

});


app.post("/delete",(req,res) =>{

  let delTitle=req.body.button;
  let delUser=x;
  Data.deleteOne({name:delUser,title:delTitle},(err)=>{
    if(!err)
    {
     // console.log(delTitle);
     // console.log(delUser);
      console.log("successfully deleted");
      Data.find({name:x},(err,Items) =>{
        if(!err)
        {
          res.render("home",{
            line1:homeStartingContent,
            posts:Items
          });
        }
      });

    }
  });
});

var  editUser='';
var editTitle='';

app.get("/edit",(req,res)=>{
  res.render("edit",{
    title:"",
    bodyy:""
  });
});

app.post("/edit",(req,res) =>{
     editUser=x;
     editTitle=req.body.button1;

  Data.findOne({name:editUser,title:editTitle},(err,Item)=>{
    if(!err)
    {
      res.render("edit",{
        title:Item.title,
        bodyy:Item.body
      });
    }
  });

});

app.post("/change",(req,res)=>{
  let editedTitle=req.body.title;
  let editedBody=req.body.body;

  Data.findOneAndUpdate({name:x,title:editTitle},{title:editedTitle,body:editedBody},(err)=>{
    if(!err)
    {
      Data.find({name:x},(err,Items)=>{
        if(!err)
        {
          res.render("home",{
            line1:homeStartingContent,
            posts:Items
          });
        }
      });
    }
  });

});



















//creating server
app.listen(process.env.PORT || 3000,() =>{
  console.log("Server stated on port 3000");
});
