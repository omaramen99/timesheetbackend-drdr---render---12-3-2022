const User = require('../models/User_model');
const Department = require('../models/Department_model');
const Week = require('../models/Week_model');
const WeeklyTasks = require('../models/WeeklyTasks_model');
const { Mongoose } = require('mongoose');
const  mongoose  = require('mongoose');
//contain all business logic
module.exports = {
 


  AllWeeklyTasksOfWeek(req, res, next){
    ///////////////Sort Logic/////////////////////////////////
    var sort = 1;
    var sortBy = "DepartmentName";
    if (req.query.sort) { 
      if (req.query.sort == 'd') {sort = -1;}
    }
   // if (req.query.sortBy) {sortBy = req.query.sortBy;}
    var SortOBJ = {};
    SortOBJ[sortBy] = sort;
    ////secondLayerNameSorting:-
    //var secondLayerNameSorting = 1;
    //if (sortBy == 'Name') {secondLayerNameSorting = sort;}
    //////////////////////////////////////////////////////////


    ///////////////Filter Logic///////////////////////////////
    var FilterOBJ = {};
    if (req.query.FilterByWeek) {FilterOBJ["WeekID"] =  new mongoose.Types.ObjectId(req.query.FilterByWeek) ;}
    //////////////////////////////////////////////////////////


    WeeklyTasks.find(FilterOBJ).sort(SortOBJ) //.sort({Name:secondLayerNameSorting})
    .then(WeeklyTasks => {
     // console.log(WeeklyTasks.length); 

      res.status(200).send(WeeklyTasks)
    })
    .catch(next)

  },
  
  userWeeklyTasksOfWeek(req, res, next){
    var filter = {WeekID : req.query.id, UserID : req.query.userID }
    WeeklyTasks.find(filter).then(week => {res.status(200).send(week)}).catch(next)
  },
  
  AllWeeklyTasksOfUser(req, res, next){
    var filter = {UserID : req.query.id }
    WeeklyTasks.find(filter).then(weeks => {res.status(200).send(weeks)}).catch(next)
  },


  CreateNewWeeklyTasks(req, res, next){
   // const Credentials = req.body.Credentials;
   // var isVarified = false;
   // const data = req.body.data;
   // const userProps = data;
  //  console.log(userProps);
     var week = new mongoose.Types.ObjectId(req.query.id);
    //var week = mongoose.Types.ObjectId("60b13202ef346c3cd4c0cfdc");
    var wklyTasks = [];
    var TasksHistoryy = [];
    User.find({Role: "Engineer"}).then(users => {
      for (let i = 0; i < users.length; i++) {
        wklyTasks.push({
          WeekID : week,
          UserID : users[i]._id,
          DepartmentName : users[i].DepartmentName
        });
      //  console.log(week);
      }
      WeeklyTasks.insertMany(wklyTasks).then(docs => {

        for (let i = 0; i < docs.length; i++) {
          TasksHistoryy.push({
            UserID: docs[i].UserID,
            WeekTasks: docs[i]._id
          })
          
        }
        // console.log(docs.length);
        
        // res.status(200).send(docs);

      }).then(() => {
        Week.findByIdAndUpdate({_id: week}, {TasksHistory: TasksHistoryy}).then(ress => {res.status(200).send("success")
         }).catch(next);
      }).catch(next)
    }).catch(next)









    //check Credentials
    // User.find(Credentials).then(user => {
    //   if (user[0].Role != 'Admin') {

    //       console.log('nope ---> not AUTHORIZED');
        
    //   }else{isVarified = true;console.log('ok2 ---> IS ADMIN');}

    //   if (isVarified) {
        
    //     Department.findById(userProps.Department).then(dep => {
    //       var userToBeAdded = 
    //       {
    //         ...userProps,
    //         DepartmentName: dep.Name,
    //         DepartmentColor: dep.Color
    //       }
    //       User.create(userToBeAdded).then(user => {
    //         res.status(201).send(user);
    //       })
    //     }).catch(next)

        
    //   } else {res.status(401).send("not authorized!");
        
    //   }

    // })
    // .catch(next);

  },
  CreateNewWeeklyTask(req, res, next){
    var data = req.body;
       WeeklyTasks.create(data).then(wklyTASK => {
        res.status(200).send("success")
       }).catch(next)

 
 
   },
 

  EditUser(req, res, next){
    const Credentials = req.body.Credentials;
    var isVarified = false;
    const data = req.body.data;
    const userId = req.query.id;

    //check Credentials
    User.find(Credentials)
    .then(user => {
      if (user[0].Role != 'Admin') {
        if (user[0]._id == userId) {
          isVarified = true;
         // console.log('ok1 ---> AUTHORIZED');
        }
      }else{isVarified = true;//console.log('ok2 ---> IS ADMIN');
    }

      if (isVarified) {
        User.findByIdAndUpdate({_id: userId}, data).then(ress => {res.status(200).send("success")}).catch(next);

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

  }

};
