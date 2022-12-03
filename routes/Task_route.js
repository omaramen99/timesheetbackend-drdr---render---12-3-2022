const Task_controller  = require('../controllers/Task_controller');
// const middleware= require('./middleware');
module.exports = (app) =>{
  

  app.get('/api/GetTask',
  Task_controller.GetTask);
  app.post('/api/GetTasks',
  Task_controller.GetTasks);
  // // //
  app.post('/api/AddTask',
  Task_controller.AddTask);
  // // //
  app.put('/api/UpdateTaskHours',
  Task_controller.UpdateTaskHours);
  app.put('/api/ApproveTask',
  Task_controller.ApproveTask);
  app.put('/api/ReviewTask',
  Task_controller.ReviewTask);

  // // //
  app.delete('/api/deleteTask',
  Task_controller.deleteTask)
  app.delete('/api/justDeleteTask',
  Task_controller.justDeleteTask)




}
