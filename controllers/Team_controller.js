const User = require('../models/User_model');
const Project = require('../models/Project_model');
const Team = require('../models/Team_model');
//const Department = require('../models/Department_model');
const { Mongoose } = require('mongoose');
const  mongoose  = require('mongoose');
//contain all business logic
module.exports = {
 


  allTeams(req, res, next){
    ///////////////Sort Logic/////////////////////////////////
    var sort = 1;
    var sortBy = "ProjectID";
    if (req.query.sort) { 
      if (req.query.sort == 'd') {sort = -1;}
    }
    var SortOBJ = {};
    SortOBJ[sortBy] = sort;
    ////secondLayerNameSorting:-
    // var secondLayerNameSorting = 1;
    // if (sortBy == 'Name') {secondLayerNameSorting = sort;}
    //////////////////////////////////////////////////////////

    Team.find({}).sort(SortOBJ) //.sort({Name:secondLayerNameSorting})
    .then(teams => {
     // console.log(teams.length); 

      res.status(200).send(teams)
    })
    .catch(next)

  },
  allTeamss(req, res, next){
    ///////////////Sort Logic/////////////////////////////////
    var teamsArr = [];
    var projectArr = [];
    var leaders = [];
    //var projectsIds = [];
    var sort = 1;
    var sortBy = "ProjectID";
    var userId = req.query.id;
    var iidd = "60b24ed59ac2e527ec174433";
    if (req.query.sort) { 
      if (req.query.sort == 'd') {sort = -1;}
    }
    var SortOBJ = {};
    SortOBJ[sortBy] = sort;
    ////secondLayerNameSorting:-
    // var secondLayerNameSorting = 1;
    // if (sortBy == 'Name') {secondLayerNameSorting = sort;}
    //////////////////////////////////////////////////////////

    Team.find({}).sort(SortOBJ) //.sort({Name:secondLayerNameSorting})
    .then(teams => {
      //console.log(teams.length);

      for (let i = 0; i < teams.length; i++) {
        var members = [...teams[i].Members,teams[i].Leader.toString()];
        var leader = teams[i].Leader.toString();
        //console.log(members.length);
        //console.log(members);
        for (let ii = 0; ii < members.length; ii++) {
         // console.log("..............................................");
         // console.log(members[ii].toString());
         // console.log(userId.toString());
          //console.log("..............................................");
          if ( members[ii].toString()== userId.toString()) {
           // console.log("ookk");
            teamsArr = [...teamsArr, {teamId: teams[i]._id, teamName : teams[i].Name}]
            projectArr = [...projectArr, teams[i].ProjectID]
            leaders= [...leaders,leader]
          }
          
        }

        
      }


      res.status(200).send({teams:teamsArr,teamLeaders:leaders,projects:projectArr})
    })
    .catch(next)

  },
  allUserTeams(req, res, next){
    
    var teamsArr = [];
    var userId = req.query.id;

    Team.find({})
    .then(teams => {
     // console.log(teams.length);

      for (let i = 0; i < teams.length; i++) {
        var members = [...teams[i].Members,teams[i].Leader.toString()];

        for (let ii = 0; ii < members.length; ii++) {

          if ( members[ii].toString()== userId.toString()) {

            teamsArr = [...teamsArr, teams[i]._id];
            break;

          }
          
        }

        
      }


      res.status(200).send({teams : teamsArr})
    })
    .catch(next)

  },
  
  GetTeam(req, res, next){
    Team.findById(req.query.id)
    .then(team => {
     // console.log(team.Name); 

      res.status(200).send(team)
    })
    .catch(next)
  },
  GetTeams(req, res, next){
    var TeamsIDs = req.body.TeamsIDs;
    var Teams = []
    for (let i = 0; i < TeamsIDs.length; i++) {
      Teams.push(mongoose.Types.ObjectId(TeamsIDs[i])); 
    }

    Team.find({'_id': { $in: Teams}}).then(Teams => {
     // console.log(Teams.length); 
      res.status(200).send(Teams)
    }).catch(next)

  },

  // Login(req, res, next){
  //   User.find(req.body)
  //   .then(User => {
  //     console.log(User[0].Name); 

  //     res.status(200).send(User[0])
  //   })
  //   .catch(next)
  // },

  AddTeam(req, res, next){
    const Credentials = req.body.Credentials;
    var isVarified = false;
    const data = req.body.data;
    const TeamProps = data;
    //console.log(userProps);

    //check Credentials
    User.find(Credentials).then(user => {
      if (user[0].Role != 'Admin') {

        // console.log('nope ---> not AUTHORIZED');
        
      }else{isVarified = true;
       // console.log('ok2 ---> IS ADMIN');
      }

      if (isVarified) {
        TeamProps.Members = [TeamProps.Leader]
        
        Project.findById(TeamProps.ProjectID).then(proj => {
          TeamProps.ProjectName = proj.Name;
          TeamProps.ProjectPhoto = proj.Album[0]; 
        }).then(() => {
          User.findById(TeamProps.Leader).then(ldr => {
            TeamProps.LeaderName = ldr.Name;
            TeamProps.LeaderPhoto = ldr.Photo;
          }).then(() => {
            Team.create(TeamProps).then(Team => {
              res.status(201).send(Team);
            }).catch(next);
            
          }).catch(next);

        }).catch(next);

      } else {res.status(401).send("not authorized!");
        
      }

    })
    .catch(next);

  },
  AddTeamm(req, res, next){
    const data = req.body.data;
    
    //console.log(userProps);

    //TeamProps.Members = [TeamProps.Leader]
    Team.create(data).then(Team => {
      res.status(201).send(Team);
    }).catch(next);



  },
//edit team name or members array
  EditTeam(req, res, next){
    const Credentials = req.body.Credentials;
    var isVarified = false;
    var data = req.body.data;
    const teamId = req.query.id;

    var members = [];


    //check Credentials
    User.find(Credentials)
    .then(user => {
      if (user[0].Role != 'Admin') {
        // if (user[0]._id == userId) {
        //   isVarified = true;
        //   console.log('ok1 ---> AUTHORIZED');
        // }
       // console.log('ok1 ---> AUTHORIZED not admin');
      }else{isVarified = true;
        //console.log('ok2 ---> IS ADMIN');
      }

      if (isVarified) {
        //console.log("line 120");
        if (req.query.editMembers) {
         // console.log("line 122");
          const editMembers = req.query.editMembers;
          Team.findById(teamId).then(team => {
            members = team.Members;
          }).then(() => {
            if (editMembers == "add") {
              members.push(req.query.memberID)
            } else {
              const index = members.indexOf(req.query.memberID);
              members.splice(index, 1);
              
            }
            data = {Members : members}

          }).then(() => {
            
            Team.findByIdAndUpdate({_id: teamId}, data).then(ress => {res.status(200).send("success")}).catch(next);

          }).catch(next);

        }else{Team.findByIdAndUpdate({_id: teamId}, data).then(ress => {res.status(200).send(ress);}).catch(next);}

      } else {res.status(401).send("not authorized")}
      
    })
    .catch(next);
  },

  EditTeamLeader(req, res, next){
    const Credentials = req.body.Credentials;
    var isVarified = false;
    const teamId = req.query.id;
    const leaderId = req.query.leaderID;
    var ldrPhoto;
    var ldrName;
    //check Credentials
    User.find(Credentials)
    .then(user => {
      if (user[0].Role != 'Admin') {
        // if (user[0]._id == userId) {
        //   isVarified = true;
        //   console.log('ok1 ---> AUTHORIZED');
        // }
       // console.log('ok1 ---> AUTHORIZED not admin');
      }else{isVarified = true;
        //console.log('ok2 ---> IS ADMIN');
      }

      if (isVarified) {
        User.findById(leaderId).then(ldr => {
          ldrName = ldr.Name;
          ldrPhoto = ldr.Photo;


        }).then(() => {
          var data = {
            Leader : leaderId,
            LeaderName : ldrName,
            LeaderPhoto : ldrPhoto
          }
          Team.findByIdAndUpdate({_id: teamId}, data).then(ress => {res.status(200).send("success")}).catch(next);
        }).catch(next);




        // console.log("line 120");
        // if (req.query.editMembers) {
        //   console.log("line 122");
        //   const editMembers = req.query.editMembers;
        //   Team.findById(teamId).then(team => {
        //     members = team.Members;
        //   }).then(() => {
        //     if (editMembers == "add") {
        //       members.push(req.query.memberID)
        //     } else {
        //       const index = members.indexOf(req.query.memberID);
        //       members.splice(index, 1);
              
        //     }
        //     data = {Members : members}

        //   }).then(() => {
            
        //     Team.findByIdAndUpdate({_id: teamId}, data).then(ress => {res.status(200).send("success")}).catch(next);

        //   }).catch(next);

        // }else{Team.findByIdAndUpdate({_id: teamId}, data).then(ress => {res.status(200).send(ress);}).catch(next);}

      } else {res.status(401).send("not authorized")}
      
    })
    .catch(next);
  },
  ChangeTeamLeader(req, res, next){
    const teamId = req.body.Tid;
    const leaderId = req.body.Lid;
      Team.findByIdAndUpdate({_id: teamId}, {Leader:leaderId},{new: true}).then(ress => {res.status(200).send(ress)}).catch(next);
    
  },
  AddAllUsersToTeam(req, res, next){
    User.find().then(Users => {
      var allMembers = [];
      for (let i = 0; i < Users.length; i++) 
      {
        allMembers.push(Users[i]._id)
      }
      const teamId = req.query.Tid;
  
      // const memberId = req.body.Mid;
  
      // var oldMembers = req.body.members;
  
      // oldMembers = [...oldMembers,memberId]
  
      Team.findByIdAndUpdate({_id: teamId}, {Members:allMembers},{new: true}).then(ress => {res.status(200).send(ress)}).catch(next);      
    })
    .catch(next)


  },
  AddTeamMember(req, res, next){

    const teamId = req.body.Tid;

    const memberId = req.body.Mid;

    var oldMembers = req.body.members;

    oldMembers = [...oldMembers,memberId ]

    Team.findByIdAndUpdate({_id: teamId}, {Members:oldMembers},{new: true}).then(ress => {res.status(200).send(ress)}).catch(next);

  },
  RemoveTeamMember(req, res, next){
    const teamId = req.body.Tid;
    const memberId = req.body.Mid;
    var oldMembers = req.body.members;

    var newMembers = oldMembers.filter(item => item !== memberId);
    //console.log("###############################################################################################");
//console.log(oldMembers);
//console.log(memberId);
//console.log(newMembers);
//console.log("###############################################################################################");
      Team.findByIdAndUpdate({_id: teamId}, {Members:newMembers},{new: true}).then(ress => {res.status(200).send(ress)}).catch(next);
    
  },

  // UpdateWeeklyHours(req, res, next){
  //   const data = req.body;
  //   const OverTimeHours = data.OverTimeHours;
  //   const TotWorkedHours = data.TotWorkedHours;
  //   const WorkedHours = data.WorkedHours;
  //   const userId_ = req.query.id;
  //   var update = {
  //     OverTimeHours:0,
  //     TotWorkedHours:0,
  //     WorkedHours:0
  // }
  //     User.findById(userId).then(user => {
  //       update.WorkedHours = user.WorkedHours + WorkedHours;
  //       update.TotWorkedHours = user.TotWorkedHours + TotWorkedHours;
  //       update.OverTimeHours = user.OverTimeHours + OverTimeHours;
  //       User.findByIdAndUpdate({_id: userId}, update).then(ress => {res.status(200).send("success")}).catch(next);
  //     }).catch(next);

  // },

  delete(req, res, next){


    const teamId = req.body.id;

    Team.findByIdAndRemove({_id: teamId})
    .then(ress => res.status(202).send("success"))

  }

};
