const WeeklyTasks_controller  = require('../controllers/WeeklyTasks_controller');
// const middleware= require('./middleware');
module.exports = (app) =>{
  
  app.get('/api/AllWeeklyTasksOfWeek',
  WeeklyTasks_controller.AllWeeklyTasksOfWeek);
  app.get('/api/userWeeklyTasksOfWeek',
  WeeklyTasks_controller.userWeeklyTasksOfWeek);
  app.get('/api/AllWeeklyTasksOfUser',
  WeeklyTasks_controller.AllWeeklyTasksOfUser);
  // app.get('/api/GetUser',
  // WeeklyTasks_controller.GetUser);
  // app.get('/api/Login',
  // WeeklyTasks_controller.Login);
  // // //
  // app.post('/api/AddUser',
  // WeeklyTasks_controller.AddUser);
  // // //
  // app.put('/api/EditUser',
  // WeeklyTasks_controller.EditUser);
  // app.put('/api/UpdateWeeklyHours',
  // WeeklyTasks_controller.UpdateWeeklyHours);
  // // //
  // app.delete('/api/deleteUser',
  // WeeklyTasks_controller.delete)
  //post by system
  app.get('/api/CreateNewWeeklyTasks',
  WeeklyTasks_controller.CreateNewWeeklyTasks);
  
  app.post('/api/CreateNewWeeklyTask',
  WeeklyTasks_controller.CreateNewWeeklyTask);




}
