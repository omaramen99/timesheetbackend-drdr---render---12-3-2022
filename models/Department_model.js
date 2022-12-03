const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DepartmentSchema = new Schema({

  Name: {
    type: String,
    required: true
  },
  Color: {
    type: String,
    required: true
  },
  GeneralLeader: {
    type: Schema.ObjectId,
    required: true
  }
});



const Department = mongoose.model('Department', DepartmentSchema,'Department');


module.exports = Department;
