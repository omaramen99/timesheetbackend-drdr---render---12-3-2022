const User = require('../models/User_model');
const Department = require('../models/Department_model');
const { Mongoose } = require('mongoose');
const  mongoose  = require('mongoose');
//contain all business logic
module.exports = {
 


  AllDepartments(req, res, next){
    Department.find({}).sort({Name:1})
    .then(dep => {
      //console.log(dep.length); 
      res.status(200).send(dep)
    })
    .catch(next)
  },
  GetDepartment(req, res, next){
    Department.findById(req.query.id)
    .then(dep => {
     // console.log(dep.Name); 
      res.status(200).send(dep)
    })
    .catch(next)
  },
  AddDepartment(req, res, next){
    const data = req.body.data;
    Department.create(data).then(dep => {
      res.status(201).send(dep);
     }).catch(next);
  },
  EditDepartment(req, res, next){
    const data = req.body.data;
    const DepartmentId = req.query.id;
    Department.findByIdAndUpdate({_id: DepartmentId}, data).then(ress => {res.status(200).send("success")}).catch(next);
  },


  EditDepartmentMembers(req, res, next){
    const Credentials = req.body.Credentials;
    var isVarified = false;
    const data = req.body.data;
    const DepartmentId = req.query.id;
    const process = req.query.process;
    var updatedMembers = []
    //check Credentials
    User.find(Credentials)
    .then(user => {
      if (user[0].Role != 'Admin') {
        
          
         // console.log('nope --->NOT AUTHORIZED');
        
      }else{isVarified = true;
        //console.log('ok2 ---> IS ADMIN');
      }

      if (isVarified) {

        Department.findById(DepartmentId).then(dep => {
          updatedMembers = [...dep.Members];
          var updatedMembers_stringed = [];
          for (let i = 0; i < updatedMembers.length; i++) {
            updatedMembers_stringed.push(updatedMembers[i].toString())
          }
          if (process == "remove") {
            const objID = data.MemberID;
            const index = updatedMembers_stringed.indexOf(objID);
            //console.log("-------------------------------------------------------------");
           // console.log(index);
            //console.log(updatedMembers);
            updatedMembers.splice(index, 1);
            //console.log(updatedMembers);
            
          }else{
            updatedMembers.push(new mongoose.Types.ObjectId(data.MemberID))
          }

          Department.findByIdAndUpdate({_id: DepartmentId}, {Members:updatedMembers}).then(ress => {res.status(200).send("success")}).catch(next);

        }).catch(next);




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
     // console.log(user[0].Role);
      if (user[0].Role != 'Admin') {

       // console.log('nope ---> not AUTHORIZED');
      
    }else{isVarified = true; //console.log('ok2 ---> IS ADMIN');
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
