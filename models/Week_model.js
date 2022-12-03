const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const WeekSchema = new Schema({
  Start_Fri: {
    type: Date,
    required: true
  },
  Vacations: {
    type: Array,
    default: [5,6]
  },
  PartialVacation: {
    type: Array,
    default: []
  },
  UsersVacation: {
    type: Array,
    default: []
  },
  TasksHistory: {
    type: Array,
    default: []
  },
  isCalculated: {
    type: Boolean,
    default: false
  }
  
});



const Week = mongoose.model('Week', WeekSchema,'Week');


module.exports = Week;
