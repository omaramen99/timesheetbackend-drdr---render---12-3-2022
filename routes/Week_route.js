const Week_controller  = require('../controllers/Week_controller');
// const middleware= require('./middleware');
module.exports = (app) =>{
  
  app.get('/api/allWeeks',
  Week_controller.allWeeks);
  app.get('/api/GetWeek',
  Week_controller.GetWeek);
    app.get('/api/GetCurrentWeeks',
  Week_controller.GetCurrentWeeks);
   app.get('/api/test1',
   Week_controller.UpdateWeeklyHOURES_GET);
   app.get('/api/test2',
   Week_controller.UpdateWeeklyHOURES_SET);
   app.get('/api/test3',
   Week_controller.ADDNewWeek);
   app.get('/ServerTime',
   Week_controller.ServerTime);
   app.get('/ping',
   Week_controller.ping);
  // // //
  // app.post('/api/AddUser',
  // Week_controller.AddUser);
  // // //
  app.put('/api/AddWeekVacation',
  Week_controller.AddWeekVacation);
  // app.put('/api/UpdateWeeklyHours',
  // Week_controller.UpdateWeeklyHours);
  // // //
  // app.delete('/api/deleteUser',
  // Week_controller.delete)
  
  
  //post by system/////////////////
  app.get('/api/NewWeek',
  Week_controller.NewWeek);


}
