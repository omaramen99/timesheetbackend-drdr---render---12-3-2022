const User = require('../models/User_model');
const Task = require('../models/Task_model');
const Department = require('../models/Department_model');
const Project = require('../models/Project_model');
const { Mongoose } = require('mongoose');
const  mongoose  = require('mongoose');
//contain all business logic
module.exports = {
 
  // AddDefaultCodeToAllProjects()
  // {
  //   Project.find().then(Projects => {
  //     Projects[0].Code = 0;
  //     for (let i = 0; i < Projects.length; i++) {
  //       Projects[i].img = "";
  //       Project.findByIdAndUpdate({_id: Projects[i]._id}, Projects[i]).then(ress => {}).catch();        
  //     }
  //   }).catch()
  // },

  AllProjects(req, res, next){
    ///////////////Sort Logic/////////////////////////////////
    var sort = 1;
    var sortBy = "Name";
    var SortOBJ = {};
    if (req.query.sort) { 
      if (req.query.sort == 'd') {sort = -1;}
    }
    if (req.query.sortByName) 
    {
      sortBy = "Name";
      SortOBJ[sortBy] = sort;
    }else
    {
      SortOBJ["_id"] = sort;
    }

    //////////////////////////////////////////////////////////

    Project.find().sort(SortOBJ)
    .then(Projects => {
      //console.log(Projects.length); 

      res.status(200).send(Projects)
    })
    .catch(next)

  },
  
  GetProject(req, res, next){
    Project.findById(req.query.id)
    .then(Project => {
     // console.log(Project.Name); 

      res.status(200).send(Project)
    })
    .catch(next)
  },
  GetProjects(req, res, next){
    var ProjectsIDs = req.body.ProjectsIDs;
    var Projects = []
    for (let i = 0; i < ProjectsIDs.length; i++) {
      Projects.push(mongoose.Types.ObjectId(ProjectsIDs[i])); 
    }

    Project.find({'_id': { $in: Projects}}).then(P => {
     // console.log(P.length); 
      res.status(200).send(P)
    }).catch(next)

  },

  AddProject(req, res, next){
    const Credentials = req.body.Credentials;
    var isVarified = false;
    const data = req.body.data;
    const projectProps = data;

    var max = 0;


    Project.find().then(Projects => {

      for (let i = 0; i < Projects.length; i++) {
        if (Projects[i].Code > max) max =  Projects[i].Code;
      }
        ///////////////////////////////////////////////////////////////
        projectProps.Code = max + 1;
        Project.create(projectProps).then(Project => {
          res.status(201).send(Project);
        }).catch(next)
        
    }).catch()






    //console.log(userProps);


  },


  test(req, res, next){

    Project.create({thisIsTestOfTimer : "HI"}).then(Project => {res.status(200).send(Project)}).catch(next)



  },
  test2(req, res, next){

    Project.create({thisIsTestOfTimer : "HO"}).then(Project => {res.status(200).send("success")}).catch(next)



  },

  EditProject(req, res, next){
    const Credentials = req.body.Credentials;
    var isVarified = false;
    const data = req.body.data;
    const projectId = req.query.id;
    const leaderId = req.query.LeaderID;

    //check Credentials
    User.find(Credentials)
    .then(user => {
      if (user[0].Role != 'Admin') {
        if (user[0]._id == leaderId) {
          isVarified = true;
          //console.log('ok1 ---> AUTHORIZED leader');
        }
      }else{isVarified = true; //console.log('ok2 ---> IS ADMIN');
    }

      if (isVarified) {
        Project.findByIdAndUpdate({_id: projectId}, data).then(ress => {res.status(200).send("success")}).catch(next);

      } else {res.status(401).send("not authorized")}
      
    })
    .catch(next);
  },
  UpdateProjectNewPhase(req, res, next){
    const Credentials = req.body.Credentials;
    var isVarified = false;
    const data = req.body.data;
    const projectId = req.query.id;
    const leaderId = req.query.LeaderID;
    var oldHistoryArr ;

    //check Credentials
    User.find(Credentials)
    .then(user => {
      if (user[0].Role != 'Admin') {
        if (user[0]._id == leaderId) {
          isVarified = true;
          //console.log('ok1 ---> AUTHORIZED leader');
        }
      }else{isVarified = true;
       // console.log('ok2 ---> IS ADMIN');
      }

      if (isVarified) {

        Project.findById(projectId).then(P => {
          oldHistoryArr = P.ProjectHistory;
          oldHistoryArr.push({
            PhaseName:data.ProjectCurrentPhase,
            PhaseDetails: data.ProjectPhaseDetails,
            PhaseStartDate: new Date(data.ProjectCurrentPhaseStartDate)
          });
          data.ProjectHistory = oldHistoryArr;

        Project.findByIdAndUpdate({_id: projectId}, data).then(ress => {res.status(200).send("success")}).catch(next);

        }).catch(next);



      } else {res.status(401).send("not authorized")}
      
    })
    .catch(next);
  },
  UpdateProjectCurrentPhase(req, res, next){
    const Credentials = req.body.Credentials;
    var isVarified = false;
    const data = req.body.data;
    const projectId = req.query.id;
    const leaderId = req.query.LeaderID;
    var oldHistoryArr ;

    //check Credentials
    User.find(Credentials)
    .then(user => {
      if (user[0].Role != 'Admin') {
        if (user[0]._id == leaderId) {
          isVarified = true;
         // console.log('ok1 ---> AUTHORIZED leader');
        }
      }else{isVarified = true;
        //console.log('ok2 ---> IS ADMIN');
      }

      if (isVarified) {

        Project.findById(projectId).then(P => {
          oldHistoryArr = P.ProjectHistory;
          oldHistoryArr[oldHistoryArr.length - 1] = {
            PhaseName:data.ProjectCurrentPhase,
            PhaseDetails: data.ProjectPhaseDetails,
            PhaseStartDate: new Date(data.ProjectCurrentPhaseStartDate)
          };
          data.ProjectHistory = oldHistoryArr;

        Project.findByIdAndUpdate({_id: projectId}, data).then(ress => {res.status(200).send("success")}).catch(next);

        }).catch(next);



      } else {res.status(401).send("not authorized")}
      
    })
    .catch(next);
  },
  UpdateProjectTeams(req, res, next){

    const data = req.body.data;
    const projectId = data.Pid;
    var oldTeams = [];

    Project.findById(projectId).then(P => {
      oldTeams = [...P.ProjectManPower,data.Tid];



    Project.findByIdAndUpdate({_id: projectId}, {ProjectManPower :oldTeams}).then(ress => {
      var result = {...ress};
      //console.log("******************************************");
      //console.log(result._doc);


      
      result._doc.ProjectManPower = [...ress.ProjectManPower,data.Tid]
      
      res.status(200).send(result);
    }).catch(next);

    }).catch(next);
  },
  UpdateProjectLeader(req, res, next){

    const data = req.body.data;
    const projectId = data.Pid;

    Project.findByIdAndUpdate({_id: projectId}, {GeneralLeader : data.Lid}).then(ress => {
      res.status(200).send(ress);
    }).catch(next);
    
  },

  UpdateProjectWeeklyHourqqs(req, res, next){
    const data = req.body;
    const OverTimeHours = data.OverTimeHours;
    const WorkingHours = data.WorkingHours;
    const projectId_ = req.query.id;
    var update = {
      OverTimeHours:0,
      WorkingHours:0
  }
      Project.findById(projectId_).then(P => {
        update.WorkingHours = P.WorkingHours + WorkingHours;
        update.OverTimeHours = P.OverTimeHours + OverTimeHours;
        Project.findByIdAndUpdate({_id: projectId_}, update).then(ress => {res.status(200).send("success")}).catch(next);
      }).catch(next);

  },
  UpdateProjectWeeklyHours(req, res, next){
    const weekId = req.query.id;
    var PIDs = [];
    var P_W = [];
    var P_O = [];
    var PTsks =[];
    Project.find({}).then(pjcts => {
for (let i = 0; i < pjcts.length; i++) {
  PIDs.push(pjcts[i]._id.toString());
  P_W.push( pjcts[i].WorkingHours);
  P_O.push( pjcts[i].OverTimeHours);
  PTsks.push({W:0,O:0});
}
Task.find({ WeekID: weekId }).then(tsks => {
  for (let i = 0; i < tsks.length; i++) {
    var II = PIDs.indexOf(tsks[i].ProjectID.toString());
    var old_W = PTsks[II].W;
    var old_O = PTsks[II].O;
    var new_W = 0;
    var new_O = 0;
    var workingDetails = tsks[i].WorkingDetails;
    new_W = workingDetails.D0.W + workingDetails.D1.W +workingDetails.D2.W + workingDetails.D3.W +workingDetails.D4.W;
    new_O = workingDetails.D0.O + workingDetails.D1.O +workingDetails.D2.O + workingDetails.D3.O +workingDetails.D4.O +workingDetails.D5.O +workingDetails.D6.O;
    PTsks[II].W = old_W + new_W;
    PTsks[II].O = old_O + new_O;
  }
  for (let i = 0; i < PTsks.length; i++) {
    Project.findByIdAndUpdate({_id: PIDs[i]}, {WorkingHours:PTsks[i].W + P_W[i], OverTimeHours:PTsks[i].O + P_O[i] }).then(ress => {
      if (i == PTsks.length - 1) {res.status(200).send("success")}
    }).catch(next);
  }
    }).catch(next);
    }).catch(next);
  },

  delete(req, res, next){
    // const Credentials = req.body;
    // var isVarified = false;
    // const userId = req.query.id;
    Project.deleteMany({thisIsTestOfTimer:"HI"}).then(ress => res.status(202).send("success") ).catch(next);
    // User.find(Credentials)
    // .then(user => {
    //   console.log(user[0].Role);
    //   if (user[0].Role != 'Admin') {

    //     console.log('nope ---> not AUTHORIZED');
      
    // }else{isVarified = true;console.log('ok2 ---> IS ADMIN');}

    // if (isVarified) {
     
    //   User.findByIdAndRemove({_id: userId})
    //     .then(ress => res.status(202).send("success"))
    //     .catch(next);
    // } else {res.status(401).send("not authorized!");
    // }
    // }).catch(next);

  }

};
