const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TaskSchema = new Schema({
  ProjectID: {
    type: Schema.ObjectId,
    required: true
  },
  WeekID: {
    type: Schema.ObjectId,
    required: true
  },
  UserID: {
    type: Schema.ObjectId,
    required: true
  },
  TeamID: {
    type: Schema.ObjectId,
    required: true
  },
  TaskType: {
    type: String,
    required: true
  },
  WorkingDetails: {
    type: Object,
    default: {
      D0:{W:0,O:0},
      D1:{W:0,O:0},
      D2:{W:0,O:0},
      D3:{W:0,O:0},
      D4:{W:0,O:0},
      D5:{O:0},
      D6:{O:0}
    }
  },
  IsApproved: {
    type: Boolean,
    default: false
  },
  IsReviewed: {
    type: Boolean,
    default: false
  },
  Review: {
    type: Number,
    default: 5
  },
  ReviewerComment: {
    type: String,
    default: ""
  }

});



const Task = mongoose.model('Task', TaskSchema,'Task');


module.exports = Task;
