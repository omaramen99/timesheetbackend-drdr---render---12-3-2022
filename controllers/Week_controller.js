const User = require('../models/User_model');
const Department = require('../models/Department_model');
const Week = require('../models/Week_model');
const WeeklyTasks = require('../models/WeeklyTasks_model');
const Task = require('../models/Task_model');
const Team = require('../models/Team_model');
const store = require('../store');
const { Mongoose } = require('mongoose');
const  mongoose  = require('mongoose');
//contain all business logic
module.exports = {
 


  allWeeks(req, res, next){
    ///////////////Sort Logic/////////////////////////////////
    var sort = 1;
    var sortBy = "_id";
    if (req.query.sort) { 
      if (req.query.sort == 'd') {sort = -1;}
    }
    //if (req.query.sortBy) {sortBy = req.query.sortBy;}
    var SortOBJ = {};
    SortOBJ[sortBy] = sort;

    ////secondLayerNameSorting:-
    // var secondLayerNameSorting = 1;
    // if (sortBy == 'Name') {secondLayerNameSorting = sort;}
    //////////////////////////////////////////////////////////


    ///////////////Filter Logic///////////////////////////////
    //var FilterOBJ = {};
    //if (req.query.FilterByDepartment) {FilterOBJ["Department"] =  new mongoose.Types.ObjectId(req.query.FilterByDepartment) ;}
    //////////////////////////////////////////////////////////


    Week.find({}).sort(SortOBJ)
    .then(weeks => {
      //console.log(weeks.length); 

      res.status(200).send(weeks)
    })
    .catch(next)

  },
  
  GetWeek(req, res, next){
    if (req.query.id) {
      Week.findById(req.query.id)
      .then(week => {
       // console.log(week.Start_Fri); 
        res.status(200).send(week)
      })
      .catch(next)
      
    } else {
      var startFriday = new Date(req.query.friday);
      Week.find({Start_Fri: startFriday}).then(week => {
        //console.log(week[0].Start_Fri); 
        res.status(200).send(week[0])
      }).catch(next)
      
    }
  },
  GetCurrentWeeks(req, res, next){
    ///////////////Sort Logic/////////////////////////////////
    var sort = -1;
    var sortBy = "_id";
    // if (req.query.sort) { 
    //   if (req.query.sort == 'd') {sort = -1;}
    // }
    //if (req.query.sortBy) {sortBy = req.query.sortBy;}
    var SortOBJ = {};
    SortOBJ[sortBy] = sort;
    ////secondLayerNameSorting:-
    // var secondLayerNameSorting = 1;
    // if (sortBy == 'Name') {secondLayerNameSorting = sort;}
    //////////////////////////////////////////////////////////


    ///////////////Filter Logic///////////////////////////////
    //var FilterOBJ = {};
    //if (req.query.FilterByDepartment) {FilterOBJ["Department"] =  new mongoose.Types.ObjectId(req.query.FilterByDepartment) ;}
    //////////////////////////////////////////////////////////


    Week.find({}).sort(SortOBJ) //.sort({Name:secondLayerNameSorting})
    .then(weeks => {
     // console.log(weeks.length); 
      var result = {current:{
        id:"",
        start:""
      },last:{
        id:"",
        start:""
      }};
      if (weeks.length >= 2) {
        
        result = {current:{
          id:weeks[0]._id,
          start:weeks[0].Start_Fri
        },last:{
          id:weeks[1]._id,
          start:weeks[1].Start_Fri
        }};
      }else
      {
        result = {current:{
          id:weeks[0]._id,
          start:weeks[0].Start_Fri
        },last:{
          id:"null",
          start:"null"
        }};
      }

    
      

      res.status(200).send(result)
    })
    .catch(next)
  },

  // Login(req, res, next){
  //   User.find(req.body)
  //   .then(User => {
  //     console.log(User[0].Name); 

  //     res.status(200).send(User[0])
  //   })
  //   .catch(next)
  // },

  NewWeek(req, res, next){

    Week.create({Start_Fri: new Date(req.query.friday)}).then(week => {
      res.status(201).send(week);
    }).catch(next);
  },
  ServerTime(req, res, next)
  {
    res.status(200).send(new Date());
  },
  ping(req, res, next)
  {
    res.status(200).send();
  },
    //////USED:
  ADDNewWeek(){
var friday = new Date();
    Week.create({Start_Fri: friday}).then(week =>{
      var wklyTasks = [];
      var TasksHistoryy = [];
      User.find().then(users => {
        for (let i = 0; i < users.length; i++) {
          wklyTasks.push({
            WeekID : week,
            UserID : users[i]._id,
            DepartmentName : users[i].DepartmentName
          });
         // console.log(week);
        }
        WeeklyTasks.insertMany(wklyTasks).then(docs => {
  
          for (let i = 0; i < docs.length; i++) {
            TasksHistoryy.push({
              UserID: docs[i].UserID,
              WeekTasks: docs[i]._id
            })
            
          }

  
        }).then(() => {

        }).catch(next)
      }).catch(next)


  }).catch(() => "fail");

  },

  AddWeekVacation(req, res, next){
    const Credentials = req.body.Credentials;
    var isVarified = false;
    const data = req.body.data;
    const weekId = req.query.id;

    //check Credentials
    User.find(Credentials)
    .then(user => {
      if (user[0].Role != 'Admin') {
        // if (user[0]._id == userId) {
        //   isVarified = true;
        //   console.log('ok1 ---> AUTHORIZED');
        // }
      }else{isVarified = true;//console.log('ok2 ---> IS ADMIN');
    }

      if (isVarified) {
        data.Vacations.push(5,6);

        Week.findByIdAndUpdate({_id: weekId}, data).then(ress => {res.status(200).send("success")}).catch(next);

      } else {res.status(401).send("not authorized")}
      
    })
    .catch(next);
  },

  UpdateWeeklyHours(req, res, next){
    const data = req.body;
    const OverTimeHours = data.OverTimeHours;
    const TotWorkedHours = data.TotWorkedHours;
    const WorkedHours = data.WorkedHours;
    const userId_ = req.query.id;
    var update = {
      OverTimeHours:0,
      TotWorkedHours:0,
      WorkedHours:0
  }
      User.findById(userId).then(user => {
        update.WorkedHours = user.WorkedHours + WorkedHours;
        update.TotWorkedHours = user.TotWorkedHours + TotWorkedHours;
        update.OverTimeHours = user.OverTimeHours + OverTimeHours;
        User.findByIdAndUpdate({_id: userId}, update).then(ress => {res.status(200).send("success")}).catch(next);
      }).catch(next);

  },

  delete(req, res, next){
    const Credentials = req.body;
    var isVarified = false;
    const userId = req.query.id;

    User.find(Credentials)
    .then(user => {
      //console.log(user[0].Role);
      if (user[0].Role != 'Admin') {

       // console.log('nope ---> not AUTHORIZED');
      
    }else{isVarified = true;//console.log('ok2 ---> IS ADMIN');
  }

    if (isVarified) {
     
      User.findByIdAndRemove({_id: userId})
        .then(ress => res.status(202).send("success"))
        .catch(next);
    } else {res.status(401).send("not authorized!");
    }
    }).catch(next);

  },
  UpdateWeeklyHOURES(){

    ///////////////////////////////////////-////----------------/////////////////////////////////////////////////////
    
    
    
    
    var foreach_WeeklyTasks = (i,wklyTasks) => 
    {
      var foreach_task = (j,tasks) => 
      {
        //console.log("###############################################################################");
       // console.log(j);
        try {
          
  
        var task = tasks[j];
        var teamID = task.TeamID;
        var userID = task.UserID;
        var W = 0;
        var O = 0;
        W = task.WorkingDetails.D0.W + task.WorkingDetails.D1.W + task.WorkingDetails.D2.W +task.WorkingDetails.D3.W + task.WorkingDetails.D4.W ;
        O = task.WorkingDetails.D0.O + task.WorkingDetails.D1.O +  task.WorkingDetails.D2.O +  task.WorkingDetails.D3.O +  task.WorkingDetails.D4.O +  task.WorkingDetails.D5.O +  task.WorkingDetails.D6.O ;
        if (task.IsApproved == true) {
          User.findById(userID)
          .then(_User => {
            var _WorkedHours = _User.WorkedHours;
            var _OverTimeHours = _User.OverTimeHours;
            _WorkedHours += W;
            _OverTimeHours += O;
            var userHoursObj = 
            {
              WorkedHours : _WorkedHours,
              OverTimeHours : _OverTimeHours
            }
            User.findByIdAndUpdate({_id: userID}, userHoursObj).then(ress => {
    var dd = ress;
//console.log( tasks.length);
//console.log("YARABbb");
    if (j+1 < tasks.length) {
      //console.log("YARAB");
      foreach_task = (j+1,tasks);
    }

    
    
            }).catch();
    
    
      
            
          })
          .catch()
          
        }else
        {
          if (j+1 < tasks.length) {
      
            foreach_task = (j+1,tasks);
          }
        }



        /////////
      } catch (error) {
       // console.log("error" + "347");
      //  console.log(j);
       // console.log(tasks.length);
        if (j+1 < tasks.length) {
    //  console.log("OOOOFFFF");
          foreach_task = (j+1,tasks);
        }
      }
      }
      var  wklyTask = wklyTasks[i];
      var userID = wklyTask.UserID;
      
      var TasksID = wklyTask.Tasks;
      Task.find({'_id':{$in:TasksID}}).then(docs => {
      //  console.log(i);
      //  console.log("///////////////////////////////////////////////////##################################################");
      //  console.log(docs);
      

      foreach_task(0,docs);



///////////////
if (i+1 < wklyTasks.length) {
  foreach_WeeklyTasks(i+1,wklyTasks)
  
}
      }).catch()
      
    }


////////////////////////////////////--------------------------------///////////////////////////////////////////

    var SortOBJ = {};
    SortOBJ["_id"] = -1;
    Week.find({}).sort(SortOBJ)
    .then(weeks => {
      var week = weeks[1];
      if (!week.isCalculated) {


        WeeklyTasks.find({'WeekID':week._id}).then(wklyTasks => {
         // console.log(wklyTasks);
          
          foreach_WeeklyTasks(0,wklyTasks);

//console.log("aaaaaaaaaaaaaaaa");



        }).catch()





        
      }

      
    })
    .catch()

  },
  //////USED:
  UpdateWeeklyHOURES_GET(){
    //RESET
store.users = {};
store.teams = {};
store.users_T = {};
store.teams_T = {};
///////////////////

    ///////////////////////////////////////-////----------------/////////////////////////////////////////////////////
    
    
    var foreach_WeeklyTask_Function = (wklyTask) => 
    {

      var foreach_task_Function = (task) => 
      {
        
        var teamID = task.TeamID;
        var userID = task.UserID;
        var W = 0;
        var O = 0;
        W = task.WorkingDetails.D0.W + task.WorkingDetails.D1.W + task.WorkingDetails.D2.W +task.WorkingDetails.D3.W + task.WorkingDetails.D4.W ;
        O = task.WorkingDetails.D0.O + task.WorkingDetails.D1.O +  task.WorkingDetails.D2.O +  task.WorkingDetails.D3.O +  task.WorkingDetails.D4.O +  task.WorkingDetails.D5.O +  task.WorkingDetails.D6.O ;
        if (task.IsApproved == true) {
          User.findById(userID)
          .then(_User => {
            var _WorkedHours = _User.WorkedHours;
            var _OverTimeHours = _User.OverTimeHours;
            _WorkedHours += W;
            _OverTimeHours += O;
            var userHoursObj = 
            {
              WorkedHours : _WorkedHours,
              OverTimeHours : _OverTimeHours
            }

           // store.s += W + O;

if (store.users[userID])  
{
  store.users[userID].WorkedHours += W;
  store.users[userID].OverTimeHours += O;
}
else
{
  store.users[userID] = {WorkedHours:0, OverTimeHours:0};
  store.users[userID].WorkedHours += W;
  store.users[userID].OverTimeHours += O;
}
if (store.users_T[userID])  
{
  store.users_T[userID].WorkedHours += W;
  store.users_T[userID].OverTimeHours += O;
}
else
{
  store.users_T[userID] = {WorkedHours: _User.WorkedHours, OverTimeHours:_User.OverTimeHours};
  store.users_T[userID].WorkedHours += W;
  store.users_T[userID].OverTimeHours += O;
}


Team.findById(teamID)
          .then(team => {

            
            if (store.teams[teamID])  
            {
              store.teams[teamID].W += W;
              store.teams[teamID].O += O;
            }
            else
            {
              store.teams[teamID] = {W:0, O:0};
              store.teams[teamID].W += W;
              store.teams[teamID].O += O;
            }
            
            if (store.teams_T[teamID])  
            {
              store.teams_T[teamID].W += W;
              store.teams_T[teamID].O += O;
            }
            else
            {
              store.teams_T[teamID] = {W:team.W, O:team.O};
              store.teams_T[teamID].W += W;
              store.teams_T[teamID].O += O;
            }



          }).catch()





  //           User.findByIdAndUpdate({_id: userID}, userHoursObj).then(() => {
    

  // //console.log( tasks.length);
  // console.log("YARABbb");
  // console.log(userID);
  
  //           }).catch(console.log("error 414"));





          })


          .catch()
        }
      }
      ////////////////////////////////////////
      var userID = wklyTask.UserID; 
      var TasksID = wklyTask.Tasks;

      Task.find({'_id':{$in:TasksID}}).then(docs => {
        //console.log(i);
        //console.log("///////////////////////////////////////////////////##################################################");
       // console.log(docs);
      for (let j = 0; j < docs.length; j++) {
        foreach_task_Function(docs[j]);
      }

     // foreach_task(0,docs);



///////////////
// if (i+1 < wklyTasks.length) {
//   foreach_WeeklyTasks(i+1,wklyTasks)
  
// }
      })


      .catch()
      

    }
    
////////////////////////////////////--------------------------------///////////////////////////////////////////

    var SortOBJ = {};
    SortOBJ["_id"] = -1;
    Week.find({}).sort(SortOBJ)
    .then(weeks => {
      var week = weeks[1];
      if (!week.isCalculated) {

        Week.findByIdAndUpdate({_id: week._id}, {isCalculated: true}).then().catch();
        WeeklyTasks.find({'WeekID':week._id}).then(wklyTasks => {
          for (let i = 0; i < wklyTasks.length; i++) {
            foreach_WeeklyTask_Function(wklyTasks[i])
          }






        })



        .catch()

      }

      
    })


    .catch()

  },
  //////USED:
  UpdateWeeklyHOURES_SET(){
  // User.findByIdAndUpdate({_id: userID}, userHoursObj).then(() => {}).catch(console.log("error 414"));
  for (const key in store.users_T) {
    //console.log(`${key}: W/ ${store.users_T[key].WorkedHours} O/ ${store.users_T[key].OverTimeHours}`);
    User.findByIdAndUpdate({_id: key}, store.users_T[key]).then().catch(console.log("error 414"));
    }
  for (const key in store.teams_T) {
    //console.log(`${key}: W/ ${store.teams[key].W} O/ ${store.teams[key].O}`);
    Team.findByIdAndUpdate({_id: key}, store.teams_T[key]).then().catch(console.log("error 414"));
    }

  },
  UpdateWeeklyHOURES_TEAM(){

    ///////////////////////////////////////-////----------------/////////////////////////////////////////////////////
    
    
    
    
    var foreach_WeeklyTasks = (i,wklyTasks) => 
    {
      var foreach_task = (j,tasks) => 
      {
       // console.log("###############################################################################");
       // console.log(j);
        try {
          
  
        var task = tasks[j];
        var teamID = task.TeamID;
        var userID = task.UserID;
        var W = 0;
        var O = 0;
        W = task.WorkingDetails.D0.W + task.WorkingDetails.D1.W + task.WorkingDetails.D2.W +task.WorkingDetails.D3.W + task.WorkingDetails.D4.W ;
        O = task.WorkingDetails.D0.O + task.WorkingDetails.D1.O +  task.WorkingDetails.D2.O +  task.WorkingDetails.D3.O +  task.WorkingDetails.D4.O +  task.WorkingDetails.D5.O +  task.WorkingDetails.D6.O ;
        if (task.IsApproved == true) {
          User.findById(userID)
          .then(_User => {
            var _WorkedHours = _User.WorkedHours;
            var _OverTimeHours = _User.OverTimeHours;
            _WorkedHours += W;
            _OverTimeHours += O;
            var userHoursObj = 
            {
              WorkedHours : _WorkedHours,
              OverTimeHours : _OverTimeHours
            }
            User.findByIdAndUpdate({_id: userID}, userHoursObj).then(ress => {
    var dd = ress;
    //console.log("line 284 @ team @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
              Team.findById(teamID).then(team => {
                var __W = team.W + W;
                var __O = team.O + O;
                var teamHoursObj = 
                {
                  W : __W,
                  O : __O
                }
               // console.log(teamHoursObj);
               // console.log(team.W);
               // console.log(team.O);
                Team.findByIdAndUpdate({_id: teamID}, teamHoursObj).then(resss => {
                 // console.log(resss);
                  //console.log("line 298 @ team @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    
    if (j+1 < tasks.length) {
      
      foreach_task = (j+1,tasks);
    }
    
    
    
    
                }).catch(() =>{  if (j+1 < tasks.length) {
      
                  foreach_task = (j+1,tasks);
                }})
    
    
    
    
    
    
    
              }).catch(() =>{  if (j+1 < tasks.length) {
      
                foreach_task = (j+1,tasks);
              }})
    
    
    
    
    
            }).catch(() =>{  if (j+1 < tasks.length) {
      
              foreach_task = (j+1,tasks);
            }});
    
    
      
            
          })
          .catch(() =>{  if (j+1 < tasks.length) {
      
            foreach_task = (j+1,tasks);
          }})
          
        }else
        {
          if (j+1 < tasks.length) {
      
            foreach_task = (j+1,tasks);
          }
        }



        /////////
      } catch (error) {
       // console.log("error" + "347");
      //  console.log(j);
       // console.log(tasks.length);
        if (j+1 < tasks.length) {
     // console.log("OOOOFFFF");
          foreach_task = (j+1,tasks);
        }
      }
      }
      var  wklyTask = wklyTasks[i];
      var userID = wklyTask.UserID;
      
      var TasksID = wklyTask.Tasks;
      Task.find({'_id':{$in:TasksID}}).then(docs => {
       // console.log(i);
      //  console.log("///////////////////////////////////////////////////##################################################");
       // console.log(docs);
      

      foreach_task(0,docs);



///////////////
if (i+1 < wklyTasks.length) {
  foreach_WeeklyTasks(i+1,wklyTasks)
  
}
      }).catch()
      
    }


////////////////////////////////////--------------------------------///////////////////////////////////////////

    var SortOBJ = {};
    SortOBJ["_id"] = -1;
    Week.find({}).sort(SortOBJ)
    .then(weeks => {
      var week = weeks[1];
      if (!week.isCalculated) {


        WeeklyTasks.find({'WeekID':week._id}).then(wklyTasks => {
        //  console.log(wklyTasks);
          
          foreach_WeeklyTasks(0,wklyTasks);

//console.log("aaaaaaaaaaaaaaaa");



        }).catch()





        
      }

      
    })
    .catch()

  },
  AAAAA()
  {
    store.s += 2;
  },
  BBBBB()
  {
    //console.log(store.users);
   // console.log(store.users_T);
   // console.log(store.teams);
   // console.log(store.teams_T);
  }

};
