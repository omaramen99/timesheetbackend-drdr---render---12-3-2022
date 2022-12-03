const express = require('express');
var cors = require('cors');

/////////////////////////////////////////////////////////
const fetch = require("node-fetch");
//const Project_controller  = require('./controllers/Project_controller');

const User_route = require('./routes/User_route')
const Department_route = require('./routes/Department_route')
const Project_route = require('./routes/Project_route')
const Team_route = require('./routes/Team_route')
const Week_route = require('./routes/Week_route')
const Task_route = require('./routes/Task_route')
const WeeklyTasks_route = require('./routes/WeeklyTasks_route')
const Week_controller  = require('./controllers/Week_controller');
const Project_controller  = require('./controllers/Project_controller');

var app = express();
app.use(cors());

// // 4 make mongo connected
var cron = require('node-cron');
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://TEAServDBusername:TEA123456789SERV@teaserves.ib0go.mongodb.net/drtimesheet?retryWrites=true&w=majority', {useNewUrlParser: true,  useUnifiedTopology: true})

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Project_controller.AddDefaultCodeToAllProjects();
// cron.schedule('0 0 * * FRI', () => {
//   //console.log('create new week every friday');
//   Week_controller.ADDNewWeek();
// });
// cron.schedule('0 0 * * TUE', () => {
//   //console.log('create new week every friday');
//   Week_controller.UpdateWeeklyHOURES_GET();
// });
// cron.schedule('5 0 * * TUE', () => {
//   //console.log('create new week every friday');
//   Week_controller.UpdateWeeklyHOURES_SET();
// });

// cron.schedule('*/0.6 * * * *', () => {
//   //console.log('create new week every friday');
//   console.log("HIIIII");
// });
 
function GetCurrentTime() {
    
    fetch('http://api.timezonedb.com/v2.1/get-time-zone?key=OWY79JY6A753&format=json&by=position&lat=40.689247&lng=-74.044502')
    .then(response => response.json())
    .then(data => {
      var MyDate = new Date(data.formatted)
      //console.log(typeof MyDate)
      console.log( MyDate.getSeconds()+1)
      console.log( MyDate)
      if (MyDate.getSeconds()+1 == 40) {
        console.log("hh");
       // Project_controller.test()
       //fetch('http://127.0.0.1:443/api/test').then(ress => console.log(ress.json()))
        
        
      }
    });
}


//////////////////////////////////////////////////////////////////////////////////////////////////
User_route(app);
Department_route(app);
Project_route(app);
Team_route(app);
Week_route(app);
Task_route(app);
WeeklyTasks_route(app);



app.use((err, req, res, next)=>{
  // any error should return from response
 // console.log(err.message);
  res.status(422).send({err: err.message})


})
// for index
module.exports = app;
// app.listen(5000, ()=>{
//   console.log('Running server');
// })