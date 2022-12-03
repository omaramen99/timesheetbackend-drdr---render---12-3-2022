const User = require('../models/User_model');
const Task = require('../models/Task_model');
const Department = require('../models/Department_model');
const { Mongoose } = require('mongoose');
const  mongoose  = require('mongoose');
//contain all business logic
module.exports = {

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
  
  GetUser(req, res, next){
    User.findById(req.query.id)
    .then(User => {
      //console.log(User.Name); 

      res.status(200).send(User)
    })
    .catch(next)
  },
  GetUserData(req, res, next){
    User.findById(req.query.id)
    .then(User => {
     // console.log(User); 

      res.status(200).send({...User._doc,UserName:"",Password:""})
    })
    .catch(next)
  },
  GetUsers(req, res, next){
    var UsersIDs = req.body.UsersIDs;
    var Users = []
    for (let i = 0; i < UsersIDs.length; i++) {
      Users.push(mongoose.Types.ObjectId(UsersIDs[i])); 
    }

    User.find({'_id': { $in: Users}}).then(Users => {
     // console.log(Users.length); 
      res.status(200).send(Users)
    }).catch(next)

  },


  Login(req, res, next){
    User.find(req.body)
    .then(User => {
     // console.log(User[0].Name); 

      res.status(200).send(User[0])
    })
    .catch(next)
  },

  AddUser(req, res, next){
    const Credentials = req.body.Credentials;
    var isVarified = false;
    const data = req.body.data;
    const userProps = data;
    //console.log(userProps);

    //check Credentials
    User.find(Credentials).then(user => {
      if (user[0].Role != 'Admin') {

         // console.log('nope ---> not AUTHORIZED');
        
      }else{isVarified = true;
        //console.log('ok2 ---> IS ADMIN');
      }

      if (isVarified) {
        
        Department.findById(userProps.Department).then(dep => {
          var userToBeAdded = 
          {
            ...userProps,
            DepartmentName: dep.Name,
            DepartmentColor: dep.Color
          }
          User.create(userToBeAdded).then(user => {
            res.status(201).send(user);
          })
        }).catch(next)

        
      } else {res.status(401).send("not authorized!");
        
      }

    })
    .catch(next);

  },
    AddNewUser(req, res, next){
    const data = req.body;
    User.create(data).then(user => {
      res.status(201).send(user);
    }).catch(next)
  },
  EditCurrentUser(req, res, next){
    const data = req.body;
    const userId = req.query.id;
    console.log(data);
    console.log(userId);
    User.findByIdAndUpdate({_id: userId}, data,{new:true}).then(ress => {res.status(200).send(ress)}).catch(next);
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
  EditUserPasswordOrPhoto(req, res, next){


    const data = req.body;
    const userId = req.query.id;

    User.findByIdAndUpdate({_id: userId}, data).then(ress => {res.status(200).send("success")}).catch(next);

  },

  UpdateWeeklyHours(req, res, next){
    const weekId = req.query.id;
    var usersIDs = [];
    var users_W = [];
    var users_O = [];
    var usersTsks =[];
    User.find({Role:"Engineer"}).then(users => {
for (let i = 0; i < users.length; i++) {
      usersIDs.push(users[i]._id.toString());
      users_W.push(users[i].WorkedHours);
      users_O.push(users[i].OverTimeHours);
      usersTsks.push({W:0,O:0});
}
Task.find({ WeekID: weekId }).then(tsks => {
  for (let i = 0; i < tsks.length; i++) {
    var II = usersIDs.indexOf(tsks[i].UserID.toString());
    var old_W = usersTsks[II].W;
    var old_O = usersTsks[II].O;
    var new_W = 0;
    var new_O = 0;
    var workingDetails = tsks[i].WorkingDetails;
    new_W = workingDetails.D0.W + workingDetails.D1.W +workingDetails.D2.W + workingDetails.D3.W +workingDetails.D4.W;
    new_O = workingDetails.D0.O + workingDetails.D1.O +workingDetails.D2.O + workingDetails.D3.O +workingDetails.D4.O +workingDetails.D5.O +workingDetails.D6.O;
    usersTsks[II].W = old_W + new_W;
    usersTsks[II].O = old_O + new_O;
  }
  for (let i = 0; i < usersTsks.length; i++) {
    User.findByIdAndUpdate({_id: usersIDs[i]}, {WorkedHours:usersTsks[i].W + users_W[i], OverTimeHours:usersTsks[i].O + users_O[i] }).then(ress => {
      if (i == usersTsks.length - 1) {res.status(200).send("success")}
    }).catch(next);
  }
    }).catch(next);
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

        //console.log('nope ---> not AUTHORIZED');
      
    }else{isVarified = true;//console.log('ok2 ---> IS ADMIN')
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
