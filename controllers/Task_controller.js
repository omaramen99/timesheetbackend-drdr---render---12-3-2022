const User = require('../models/User_model');
const Week = require('../models/Week_model');
const Project = require('../models/Project_model');
const Team = require('../models/Team_model');
const Department = require('../models/Department_model');
const Task = require('../models/Task_model');
const WeeklyTasks = require('../models/WeeklyTasks_model');
const { Mongoose } = require('mongoose');
const  mongoose  = require('mongoose');
//contain all business logic
module.exports = {
 
  GetWeekTaskOfUser(req, res, next){


    User.find(FilterOBJ).sort(SortOBJ).sort({Name:secondLayerNameSorting})
    .then(Users => {
      //console.log(Users.length); 

      res.status(200).send(Users)
    })
    .catch(next)

  },

  allUsers(req, res, next){
    ///////////////Sort Logic/////////////////////////////////
    var sort = 1;
    var sortBy = "department";
    if (req.query.sort) { 
      if (req.query.sort == 'd') {sort = -1;}
    }
    if (req.query.sortBy) {sortBy = req.query.sortBy;}
    var SortOBJ = {};
    SortOBJ[sortBy] = sort;
    ////secondLayerNameSorting:-
    var secondLayerNameSorting = 1;
    if (sortBy == 'Name') {secondLayerNameSorting = sort;}
    //////////////////////////////////////////////////////////


    ///////////////Filter Logic///////////////////////////////
    var FilterOBJ = {};
   if (req.query.FilterByDepartment) {FilterOBJ["Department"] =  new mongoose.Types.ObjectId(req.query.FilterByDepartment) ;}
    //////////////////////////////////////////////////////////


    User.find(FilterOBJ).sort(SortOBJ).sort({Name:secondLayerNameSorting})
    .then(Users => {
      //console.log(Users.length); 

      res.status(200).send(Users)
    })
    .catch(next)

  },
  
  GetTask(req, res, next){
    Task.findById(req.query.id)
    .then(task => {
     // console.log(task.TaskType); 

      res.status(200).send(task)
    })
    .catch(next)
  },
  GetTasks(req, res, next){
    var TasksIDs = req.body.TasksIDs;
    var Tasks = []
    for (let i = 0; i < TasksIDs.length; i++) {
      Tasks.push(mongoose.Types.ObjectId(TasksIDs[i])); 
    }

    Task.find({'_id': { $in: Tasks}}).then(Tasks => {
      //console.log(Tasks.length); 
      res.status(200).send(Tasks)
    }).catch(next)

  },


  AddTask(req, res, next){
var tskID;
    const data = req.body;
    Task.create(data).then(task => {
     // console.log(75);
       tskID = task._id;
    }).then(() => {
     // console.log(78);
     // console.log(req.body.WeekID);
     // console.log(req.body.UserID);
      WeeklyTasks.find({WeekID : req.body.WeekID, UserID : req.body.UserID }).then(task => {
       // console.log(80);
       // console.log(task);
       // console.log(82);
        return [task[0]._id,task[0].Tasks];
       // console.log(84);

      }).then(wklyTsk => {
       // console.log(87);
        WeeklyTasks.findByIdAndUpdate({_id: wklyTsk[0]}, {Tasks: [...wklyTsk[1],tskID]})
        .then(ress => {
        //  console.log(90);
          res.status(200).send("success")
      }).catch(next);
      }).catch(next);
    }).catch(next);

  },

  UpdateTaskHours(req, res, next){
//console.log(req.body);
    var data = {} ;
    var leaderEdit = false;
if (req.body.leaderEdit) {
  data["WorkingDetails"] = req.body.WorkingDetails;
  leaderEdit = true;
}else{data = req.body;}

    const TaskId = req.query.id;
    Task.findById(TaskId).then(task => {
      return task.IsApproved;
    }).then(IsApproved => {
        if (leaderEdit) {
          Task.findByIdAndUpdate({_id: TaskId}, data).then(ress => {res.status(200).send("success")}).catch(next);
        }else{
          if (!IsApproved) {
            Task.findByIdAndUpdate({_id: TaskId}, data).then(ress => {res.status(200).send("success")}).catch(next);
          } else {
            res.status(401).send("approved task")
          }

        }


    }).catch(next);
    
  },
  ApproveTask(req, res, next){
    const TaskId = req.query.id;
    const LeaderId = req.query.LeaderId;
    var teamLeaderID = ""
    var approval = {IsApproved: true}
    if (req.query.approval == "false") {approval = {IsApproved: false}}
    Task.findById(TaskId).then(task => {
    return task.TeamID;
    }).then(teamID => {
      Team.findById(teamID).then(team => {
        return team.Leader
      }).then(ldrID => {teamLeaderID = ldrID; return ldrID;}).then(id => {
        if (id == LeaderId) {
          //authorized:-
          Task.findByIdAndUpdate({_id: TaskId}, approval).then(ress => {res.status(200).send("success")}).catch(next);
        } else {
          res.status(401).send("not authorized")
        }
      }).catch(next);
    }).catch(next);
  },
  ReviewTask(req, res, next){
    const TaskId = req.query.id;
    const LeaderId = req.query.LeaderId;
    var teamLeaderID = ""
    var review = {Review: parseFloat(req.query.rate), ReviewerComment:req.query.comment}
    Task.findById(TaskId).then(task => {
    return task.TeamID;
    }).then(teamID => {
      Team.findById(teamID).then(team => {
        return team.Leader
      }).then(ldrID => {teamLeaderID = ldrID; return ldrID;}).then(id => {
        if (id == LeaderId) {
          //authorized:-
          Task.findByIdAndUpdate({_id: TaskId}, review).then(ress => {res.status(200).send("success")}).catch(next);
        } else {
          res.status(401).send("not authorized")
        }
      }).catch(next);
    }).catch(next);
  },



  // deleteTask(req, res, next){

  //   const taskId = req.query.id;

  //   Task.findByIdAndRemove({_id: taskId})
  //       .then(ress => res.status(202).send("success"))
  //       .catch(next);

        
  // },
  deleteTask(req, res, next){
    const tskID = req.query.id;
    const weekID = req.query.weekID;
    const userID = req.query.userID;
    
   // var tskID;
        //const data = req.body;
        Task.findByIdAndRemove({_id: tskID})
        .then(() => {
          WeeklyTasks.find({WeekID : weekID, UserID : userID }).then(task => {
           // console.log(task);
    
            return [task[0]._id,task[0].Tasks];
    
    
          }).then(wklyTsk => {
            var tasksArr = [...wklyTsk[1]];
            var tasksArrStringed = [];
            for (let i = 0; i < tasksArr.length; i++) {
              tasksArrStringed.push(tasksArr[i].toString())
            }
            const index = tasksArrStringed.indexOf(tskID);
            //console.log(index);
           // console.log('-------------------------');
           // console.log(tasksArrStringed.length);
            tasksArr.splice(index, 1);
            WeeklyTasks.findByIdAndUpdate({_id: wklyTsk[0]}, {Tasks: tasksArr})
            .then(ress => {res.status(200).send("success")}).catch(next);
          }).catch(next);
        }).catch(next);
    
      },
      justDeleteTask(req, res, next){
        const tskID = req.query.id;

        
       // var tskID;
            //const data = req.body;
            Task.findByIdAndRemove({_id: tskID})
            .then(() => {res.status(200).send("success")
            }).catch(next);
        
          }

};
 