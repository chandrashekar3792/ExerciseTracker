const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userModel= require("./userModel");
const exerciseModel=require("./exerciseModel");
const cors = require('cors')

const mongoose = require('mongoose')
mongoose.Promise     = global.Promise;
mongoose.connect(process.env.MLAB_URI, {
  useMongoClient: true,
});
app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.post("/api/exercise/new-user",(req,res)=>{
  userModel.findOne({username:req.body.username})
    .then((resultUser)=>{
      if(resultUser){
        console.log("resultUSer",resultUser);
        res.send("username already taken");
      }else{
        return userModel.create({username:req.body.username})
          .then((newUser)=>{
              res.send(newUser)
          })
      }
  }).catch((err)=>{res.send(err)});
});

app.post("/api/exercise/add",(req,res)=>{
  exerciseModel.create({userId:req.body.userId,description:req.body.description,duration:req.body.duration,date:new Date(req.body.date)})
    .then((resultExer)=>{
      return userModel.findOne({_id:resultExer.userId}).then((resultUser)=>{
        let result={
          username:resultUser.username,
          date:resultExer.date.toDateString(),
          duration:resultExer.duration,
          _id:resultExer._id,
          description:resultExer.description
        }
        console.log("result",resultUser);
        res.json(result);
      })
    })
    .catch((err)=>{
      res.send(err);
    });
});

app.get("/api/exercise/log",(req,res)=>{
  if(req.query.userId){
    console.log("req.query",req.query);
    var query={
      userId:new mongoose.Types.ObjectId(req.query.userId)
    };
    console.log("query",query);
    if(req.query.from || req.query.to){
      query.date={};
      if(req.query.from){
        query.date.$gte=new Date(req.query.from);
      }else{
         query.date.$le=new Date(req.query.to);
      }
    }
    if(req.query.limit){
      exerciseModel.find(query).limit(parseInt(req.query.limit))
        .then((result)=>{
          res.json(result);
        })
        .catch((err)=>res.send(err));
    }else{
        exerciseModel.find(query)
        .then((result)=>{
          res.json(result);
        })
        .catch((err)=>res.send(err));
    }
  }else{
    res.send("Invalid Parameters");
  }
});
// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
