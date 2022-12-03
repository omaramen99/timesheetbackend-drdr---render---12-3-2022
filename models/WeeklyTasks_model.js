const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const WeeklyTasksSchema = new Schema({
  WeekID: {
    type: Schema.ObjectId,
    required: true
  },
  UserID: {
    type: Schema.ObjectId,
    required: true
  },
  Tasks: {
    type: Array,
    default: []
  },
  IsApproved: {
    type: Boolean,
    default: true
  },
  DepartmentName: {
    type: String,
    required: true
  }

});



const WeeklyTasks = mongoose.model('WeeklyTasks', WeeklyTasksSchema,'WeeklyTasks');


module.exports = WeeklyTasks;
