const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const TeamSchema = new Schema({

  Name: {
    type: String,
    required: true
  },
  ProjectID: {
    type: Schema.ObjectId,
    required: true
  },
  Leader: {
    type: Schema.ObjectId,
    required: true
  },
  Members: {
    type: Array,
    dafault: []
  },
  W: {
    type: Number,
    default: 0.00
  },
  O: {
    type: Number,
    default: 0.00
  }

  
});



const Team = mongoose.model('Team', TeamSchema,'Team');


module.exports = Team;
