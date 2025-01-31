const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const mongoConnect=require("./util/database").mongoConnect;
const mangoose =require("mongoose")
const User=require("./models/user")

const errorController = require('./controllers/error');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { rmSync } = require('fs');
const { default: mongoose } = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use(async(req,res,next)=>{
   const user=await User.findById("679ca629feb6664a90fd84b6");
   req.user=user;
   console.log(req.user)
   next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// mongoConnect(()=>{
//    app.listen(3000)
// })

mongoose.connect('mongodb+srv://suvransu:rinku@cluster0.kgx79.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
).then(result=>{
  User.findOne().then(user=>{
    if(!user){
      const user=new User({
        name:"rinku",
        email:"rinku",
        cart: {
          items:[]
        }
      })
      user.save();
    }
  })

  app.listen(3000)
}).catch(err=>{
    console.log(err)
})



