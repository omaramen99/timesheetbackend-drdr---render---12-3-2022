const { Number } = require('mongoose');
const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProjectSchema = new Schema({
  Name: {
    type: String,
    required: true
  },
  Code: {
    type: Number,
    required: true
  },
  ProjectManPower: {
    type: Array,
    default: []
  },
  GeneralLeader: {
    type: Schema.ObjectId,
    required: true
  },
  // img: {
  //   type: String,
  //   default: "https://img.forconstructionpros.com/files/base/acbm/fcp/image/2020/06/16x9/safety_health_worker_engineer_construction_industry_1575605_pxhere.com.5efa3b20c2d9b.5efa3b5623986.png?auto=format%2Ccompress&q=70"
  // },
  img: {
    type: String,
    default: ""
  },
  
});
// const ProjectSchema = new Schema({
//   thisIsTestOfTimer: {
//     type: String,
//     required: true
//   }
  
// });


const Project = mongoose.model('Project', ProjectSchema,'Project');


module.exports = Project;
